import { NextResponse } from "next/server";
import { and, desc, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { employmentRelationships, wageAgreements, users, workSessions } from "@/db/schema";
import { getPrincipal, type Principal } from "@/lib/auth";
import { getOwnedRelationship, type Agreement } from "@/lib/access";
import { Errors, errorResponse, isUniqueViolation } from "@/lib/errors";
import { logAuditEvent } from "@/lib/audit";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { normalizeEmail, num, oneOf, readJson, str, uuid, type Body } from "@/lib/validate";

export const dynamic = "force-dynamic";

const today = () => new Date().toISOString().split("T")[0];
const proposerOf = (a: Agreement): "worker" | "employer" | null =>
  a.workerAcceptedAt && !a.employerAcceptedAt ? "worker" : a.employerAcceptedAt && !a.workerAcceptedAt ? "employer" : null;

/* ---------------- GET: only the principal's own relationships ---------------- */
export async function GET(request: Request) {
  try {
    const p = await getPrincipal(request);
    const rels = await db
      .select()
      .from(employmentRelationships)
      .where(p.role === "worker" ? eq(employmentRelationships.workerId, p.userId) : eq(employmentRelationships.employerId, p.userId))
      .orderBy(desc(employmentRelationships.createdAt));

    const relIds = rels.map((r) => r.id);
    const userIds = [...new Set(rels.flatMap((r) => [r.workerId, r.employerId]))];
    const [userRows, agreementRows] = await Promise.all([
      userIds.length ? db.select({ id: users.id, name: users.name, phone: users.phone }).from(users).where(inArray(users.id, userIds)) : [],
      relIds.length ? db.select().from(wageAgreements).where(inArray(wageAgreements.relationshipId, relIds)).orderBy(desc(wageAgreements.version)) : [],
    ]);
    const uMap = new Map(userRows.map((u) => [u.id, u]));

    const relationships = rels.map((r) => {
      const history = agreementRows.filter((a) => a.relationshipId === r.id);
      const active = history.find((a) => a.status === "active");
      const pendingAgreement = history.find((a) => a.status === "pending_acceptance") ?? null;
      const w = uMap.get(r.workerId);
      const e = uMap.get(r.employerId);
      const live = r.status === "active"; // contact numbers only shared once the relationship is mutually accepted
      return {
        ...r,
        workerName: w?.name || "Worker",
        workerPhone: live ? w?.phone || "" : "",
        employerName: e?.name || "Employer",
        employerPhone: live ? e?.phone || "" : "",
        agreement: active ?? pendingAgreement ?? history[0] ?? null,
        pendingAgreement,
        agreementHistory: history,
        awaitingMyResponse: r.status === "pending" && r.initiatedByRole !== p.role,
      };
    });
    return NextResponse.json({ relationships });
  } catch (e) {
    return errorResponse(e, "employment-get");
  }
}

/* ---------------- POST: action-based ---------------- */
function parseTerms(b: Body, fallback?: Agreement) {
  return {
    jobType: str(b, "jobType", { max: 100, required: false }) ?? fallback?.jobType ?? str(b, "roleTitle", { max: 100, required: false }) ?? "Work",
    wageType: oneOf(b, "wageType", ["daily", "hourly"] as const, (fallback?.wageType as "daily" | "hourly") ?? "daily"),
    wageAmount: (num(b, "wageAmount", { min: 1, max: 1_000_000, required: !fallback }) ?? Number(fallback?.wageAmount)).toFixed(2),
    expectedHoursPerDay: (num(b, "expectedHoursPerDay", { min: 0.5, max: 24 }) ?? Number(fallback?.expectedHoursPerDay ?? 8)).toFixed(2),
    overtimeRateHourly: (num(b, "overtimeRateHourly", { min: 0, max: 100000 }) ?? Number(fallback?.overtimeRateHourly ?? 0)).toFixed(2),
    paymentFrequency: oneOf(b, "paymentFrequency", ["daily", "weekly", "monthly"] as const, (fallback?.paymentFrequency as "monthly") ?? "monthly"),
  };
}

export async function POST(request: Request) {
  try {
    const p = await getPrincipal(request);
    const b = await readJson(request);
    const action = oneOf(b, "action", ["create", "respond", "upgrade_agreement", "accept_agreement", "reject_agreement", "end"] as const, "create");
    const now = new Date();

    /* ---- create: send a request to an existing counterparty (found by exact email) ---- */
    if (action === "create") {
      await rateLimit(`lookup:${p.userId}`, 20, 60 * 60 * 1000);
      const email = normalizeEmail(str(b, "counterpartyIdentifier", { max: 254 })!);
      const wantRole = p.role === "worker" ? "employer" : "worker";
      const [other] = await db.select().from(users).where(and(eq(users.email, email), eq(users.role, wantRole), eq(users.isActive, true))).limit(1);
      if (!other || other.id === p.userId) {
        throw Errors.notFound(`No registered ${wantRole} found with this email. Ask them to sign up first.`, `इस ईमेल से कोई ${wantRole === "employer" ? "नियोक्ता" : "श्रमिक"} पंजीकृत नहीं है। उनसे पहले साइन अप करने को कहें।`);
      }
      const terms = parseTerms(b);
      const roleTitle = str(b, "roleTitle", { max: 100, required: false }) ?? terms.jobType;
      const workerId = p.role === "worker" ? p.userId : other.id;
      const employerId = p.role === "employer" ? p.userId : other.id;

      try {
        const result = await db.transaction(async (tx) => {
          const [rel] = await tx.insert(employmentRelationships).values({ workerId, employerId, roleTitle, status: "pending", initiatedByRole: p.role, notes: str(b, "notes", { max: 300, required: false }) ?? null }).returning();
          const [agr] = await tx.insert(wageAgreements).values({
            relationshipId: rel.id, workerId, employerId, version: 1, ...terms,
            status: "pending_acceptance", startDate: today(),
            workerAcceptedAt: p.role === "worker" ? now : null,
            employerAcceptedAt: p.role === "employer" ? now : null,
          }).returning();
          return { rel, agr };
        });
        await logAuditEvent({ actor: p, action: "EMPLOYMENT_REQUESTED", entityType: "employment_relationship", entityId: result.rel.id, details: `Request sent with wage agreement v1 (${terms.wageAmount}/${terms.wageType})`, scopeWorkerId: workerId, scopeEmployerId: employerId, after: result.rel, request });
        return NextResponse.json({ success: true, relationship: result.rel, agreement: result.agr }, { status: 201 });
      } catch (e) {
        if (isUniqueViolation(e, "uniq_live_relationship")) throw Errors.conflict("RELATIONSHIP_EXISTS", "A pending or active relationship with this person already exists.", "इस व्यक्ति के साथ पहले से अनुरोध या संबंध मौजूद है।");
        throw e;
      }
    }

    /* ---- respond: the party who did NOT initiate accepts/rejects ---- */
    if (action === "respond") {
      const rel = await getOwnedRelationship(p, uuid(b, "relationshipId")!);
      const decision = oneOf(b, "decision", ["accept", "reject"] as const);
      if (rel.status !== "pending") throw Errors.conflict("NOT_PENDING", "This request is no longer pending.", "यह अनुरोध अब लंबित नहीं है।");
      if (rel.initiatedByRole === p.role) throw Errors.forbidden("You cannot respond to your own request.", "आप अपने ही अनुरोध का उत्तर नहीं दे सकते।");
      const out = await db.transaction(async (tx) => {
        const [updated] = await tx.update(employmentRelationships)
          .set(decision === "accept" ? { status: "active", acceptedAt: now, updatedAt: now } : { status: "rejected", updatedAt: now })
          .where(and(eq(employmentRelationships.id, rel.id), eq(employmentRelationships.status, "pending"))).returning();
        if (!updated) throw Errors.conflict("NOT_PENDING", "This request is no longer pending.");
        await tx.update(wageAgreements)
          .set(decision === "accept" ? { status: "active", ...(p.role === "worker" ? { workerAcceptedAt: now } : { employerAcceptedAt: now }) } : { status: "cancelled" })
          .where(and(eq(wageAgreements.relationshipId, rel.id), eq(wageAgreements.status, "pending_acceptance")));
        return updated;
      });
      await logAuditEvent({ actor: p, action: decision === "accept" ? "EMPLOYMENT_ACCEPTED" : "EMPLOYMENT_REJECTED", entityType: "employment_relationship", entityId: rel.id, scopeWorkerId: rel.workerId, scopeEmployerId: rel.employerId, before: rel, after: out, request });
      return NextResponse.json({ success: true, relationship: out });
    }

    /* ---- propose a new agreement version (needs the other party's acceptance) ---- */
    if (action === "upgrade_agreement") {
      const rel = await getOwnedRelationship(p, uuid(b, "relationshipId")!, { requireActive: true });
      const all = await db.select().from(wageAgreements).where(eq(wageAgreements.relationshipId, rel.id)).orderBy(desc(wageAgreements.version));
      if (all.some((a) => a.status === "pending_acceptance")) throw Errors.conflict("AGREEMENT_PENDING", "A wage proposal is already waiting for a response.", "एक वेतन प्रस्ताव पहले से उत्तर की प्रतीक्षा में है।");
      const base = all.find((a) => a.status === "active") ?? all[0];
      const terms = parseTerms(b, base);
      const [agr] = await db.insert(wageAgreements).values({
        relationshipId: rel.id, workerId: rel.workerId, employerId: rel.employerId, version: (all[0]?.version ?? 0) + 1, ...terms,
        status: "pending_acceptance", startDate: today(),
        workerAcceptedAt: p.role === "worker" ? now : null, employerAcceptedAt: p.role === "employer" ? now : null,
      }).returning();
      await logAuditEvent({ actor: p, action: "WAGE_AGREEMENT_PROPOSED", entityType: "wage_agreement", entityId: agr.id, details: `v${agr.version}: ${agr.wageAmount}/${agr.wageType}`, scopeWorkerId: rel.workerId, scopeEmployerId: rel.employerId, after: agr, request });
      return NextResponse.json({ success: true, agreement: agr }, { status: 201 });
    }

    /* ---- accept / reject a pending agreement version ---- */
    if (action === "accept_agreement" || action === "reject_agreement") {
      const [agr] = await db.select().from(wageAgreements).where(eq(wageAgreements.id, uuid(b, "agreementId")!)).limit(1);
      if (!agr) throw Errors.notFound("Agreement not found.");
      const rel = await getOwnedRelationship(p, agr.relationshipId, { requireActive: true });
      if (agr.status !== "pending_acceptance") throw Errors.conflict("NOT_PENDING", "This agreement is not waiting for a response.");
      const proposer = proposerOf(agr);
      if (action === "reject_agreement") {
        const [c] = await db.update(wageAgreements).set({ status: "cancelled" }).where(and(eq(wageAgreements.id, agr.id), eq(wageAgreements.status, "pending_acceptance"))).returning();
        await logAuditEvent({ actor: p, action: "WAGE_AGREEMENT_REJECTED", entityType: "wage_agreement", entityId: agr.id, scopeWorkerId: rel.workerId, scopeEmployerId: rel.employerId, before: agr, after: c, request });
        return NextResponse.json({ success: true, agreement: c });
      }
      if (proposer === p.role) throw Errors.forbidden("The other party must accept your proposal.", "आपके प्रस्ताव को दूसरे पक्ष को स्वीकार करना होगा।");
      const activated = await db.transaction(async (tx) => {
        await tx.update(wageAgreements).set({ status: "superseded", endDate: today() }).where(and(eq(wageAgreements.relationshipId, rel.id), eq(wageAgreements.status, "active")));
        const [a] = await tx.update(wageAgreements)
          .set({ status: "active", ...(p.role === "worker" ? { workerAcceptedAt: now } : { employerAcceptedAt: now }), startDate: today() })
          .where(and(eq(wageAgreements.id, agr.id), eq(wageAgreements.status, "pending_acceptance"))).returning();
        if (!a) throw Errors.conflict("NOT_PENDING", "This agreement is not waiting for a response.");
        return a;
      });
      await logAuditEvent({ actor: p, action: "WAGE_AGREEMENT_ACCEPTED", entityType: "wage_agreement", entityId: agr.id, details: `v${agr.version} now active; previous version superseded`, scopeWorkerId: rel.workerId, scopeEmployerId: rel.employerId, before: agr, after: activated, request });
      return NextResponse.json({ success: true, agreement: activated });
    }

    /* ---- end relationship ---- */
    const rel = await getOwnedRelationship(p, uuid(b, "relationshipId")!, { requireActive: true });
    const open = await db.select({ id: workSessions.id }).from(workSessions).where(and(eq(workSessions.relationshipId, rel.id), eq(workSessions.status, "open"))).limit(1);
    if (open.length) throw Errors.conflict("ACTIVE_SESSION_EXISTS", "End the open work session before ending this relationship.", "पहले चालू कार्य सत्र समाप्त करें।");
    const [ended] = await db.update(employmentRelationships).set({ status: "ended", endedAt: now, updatedAt: now }).where(eq(employmentRelationships.id, rel.id)).returning();
    await logAuditEvent({ actor: p, action: "EMPLOYMENT_ENDED", entityType: "employment_relationship", entityId: rel.id, scopeWorkerId: rel.workerId, scopeEmployerId: rel.employerId, before: rel, after: ended, request });
    return NextResponse.json({ success: true, relationship: ended });
  } catch (e) {
    return errorResponse(e, "employment-post");
  }
}
