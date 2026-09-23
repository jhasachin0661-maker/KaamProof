import { NextResponse } from "next/server";
import { and, desc, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { disputes, users, workSessions, payments } from "@/db/schema";
import { getPrincipal, requireEmployer } from "@/lib/auth";
import { getOwnedRelationship } from "@/lib/access";
import { Errors, errorResponse } from "@/lib/errors";
import { logAuditEvent } from "@/lib/audit";
import { oneOf, readJson, str, uuid } from "@/lib/validate";

export const dynamic = "force-dynamic";
const CATEGORIES = ["wrong_duration", "missing_payment", "unagreed_deduction", "unconfirmed_session", "other"] as const;

/** Shown in the UI: the employer is a party to every dispute they review. */
const CONFLICT_NOTICE =
  "This dispute is reviewed by the employer, who is a party to it. It is a record of the employer's response, not a neutral or legally binding decision.";

export async function GET(request: Request) {
  try {
    const p = await getPrincipal(request);
    const rows = await db.select().from(disputes)
      .where(p.role === "worker" ? eq(disputes.workerId, p.userId) : eq(disputes.employerId, p.userId))
      .orderBy(desc(disputes.createdAt)).limit(300);
    const ids = [...new Set(rows.flatMap((d) => [d.workerId, d.employerId, d.raisedByUserId]))];
    const names = ids.length ? await db.select({ id: users.id, name: users.name }).from(users).where(inArray(users.id, ids)) : [];
    const nm = new Map(names.map((u) => [u.id, u.name]));
    return NextResponse.json({
      conflictNotice: CONFLICT_NOTICE,
      disputes: rows.map((d) => ({ ...d, workerName: nm.get(d.workerId) || "Worker", employerName: nm.get(d.employerId) || "Employer", raisedByName: nm.get(d.raisedByUserId) || "User" })),
    });
  } catch (e) {
    return errorResponse(e, "disputes-get");
  }
}

export async function POST(request: Request) {
  try {
    const b = await readJson(request);
    const action = oneOf(b, "action", ["create", "review", "resolve"] as const, "create");

    if (action === "create") {
      const p = await getPrincipal(request);
      const sessionId = uuid(b, "sessionId", false);
      const paymentId = uuid(b, "paymentId", false);
      let relationshipId = uuid(b, "relationshipId", false);
      // Derive the relationship from the linked record so the parties can never be spoofed.
      if (sessionId) {
        const [s] = await db.select().from(workSessions).where(eq(workSessions.id, sessionId)).limit(1);
        if (!s) throw Errors.notFound("Work session not found.");
        relationshipId = s.relationshipId;
      } else if (paymentId) {
        const [pay] = await db.select().from(payments).where(eq(payments.id, paymentId)).limit(1);
        if (!pay) throw Errors.notFound("Payment not found.");
        relationshipId = pay.relationshipId;
      }
      if (!relationshipId) throw Errors.invalid("relationshipId, sessionId or paymentId is required.");
      const rel = await getOwnedRelationship(p, relationshipId); // 404 unless the caller is a party
      const description = str(b, "description", { min: 3, max: 1000 })!;
      const [d] = await db.insert(disputes).values({
        raisedByUserId: p.userId, workerId: rel.workerId, employerId: rel.employerId, sessionId: sessionId ?? null, paymentId: paymentId ?? null,
        reasonCategory: oneOf(b, "reasonCategory", CATEGORIES, "other"), description, status: "open",
      }).returning();
      await logAuditEvent({ actor: p, action: "DISPUTE_RAISED", entityType: "dispute", entityId: d.id, details: description, scopeWorkerId: rel.workerId, scopeEmployerId: rel.employerId, after: d, request });
      return NextResponse.json({ success: true, dispute: d }, { status: 201 });
    }

    // review / resolve: ONLY the employer of that dispute (and the UI states this is not neutral)
    const p = await requireEmployer(request);
    const [d] = await db.select().from(disputes).where(and(eq(disputes.id, uuid(b, "disputeId")!), eq(disputes.employerId, p.userId))).limit(1);
    if (!d) throw Errors.notFound("Dispute not found.", "विवाद नहीं मिला।");
    if (d.status === "resolved" || d.status === "rejected") throw Errors.conflict("DISPUTE_NOT_ALLOWED", "This dispute is already closed.", "यह विवाद पहले ही बंद हो चुका है।");

    if (action === "review") {
      const [u] = await db.update(disputes).set({ status: "under_review" }).where(eq(disputes.id, d.id)).returning();
      await logAuditEvent({ actor: p, action: "DISPUTE_UNDER_REVIEW", entityType: "dispute", entityId: d.id, scopeWorkerId: d.workerId, scopeEmployerId: d.employerId, before: { status: d.status }, after: { status: u.status }, request });
      return NextResponse.json({ success: true, dispute: u, notice: CONFLICT_NOTICE });
    }
    const status = oneOf(b, "status", ["resolved", "rejected"] as const, "resolved");
    const note = str(b, "resolutionNote", { min: 3, max: 1000 })!;
    const [u] = await db.update(disputes).set({ status, resolutionNote: note, resolvedAt: new Date(), resolvedByUserId: p.userId }).where(eq(disputes.id, d.id)).returning();
    await logAuditEvent({ actor: p, action: "DISPUTE_RESOLVED", entityType: "dispute", entityId: d.id, details: note, scopeWorkerId: d.workerId, scopeEmployerId: d.employerId, before: { status: d.status }, after: { status: u.status }, request });
    return NextResponse.json({ success: true, dispute: u, notice: CONFLICT_NOTICE });
  } catch (e) {
    return errorResponse(e, "disputes-post");
  }
}
