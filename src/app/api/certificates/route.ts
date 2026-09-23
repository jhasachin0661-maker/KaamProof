import { NextResponse } from "next/server";
import { and, desc, eq, gte, lte } from "drizzle-orm";
import { db } from "@/db";
import { certificates, users, workSessions, payments, workerProfiles, wageAgreements } from "@/db/schema";
import { getPrincipal, requireWorker } from "@/lib/auth";
import { getOwnedRelationship } from "@/lib/access";
import { Errors, errorResponse, isUniqueViolation } from "@/lib/errors";
import { generateCanonicalHash, generateCertificateCode } from "@/lib/crypto";
import { logAuditEvent } from "@/lib/audit";
import { isoDate, oneOf, readJson, str, uuid } from "@/lib/validate";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const p = await getPrincipal(request);
    const list = await db.select().from(certificates)
      .where(p.role === "worker" ? eq(certificates.workerId, p.userId) : eq(certificates.employerId, p.userId))
      .orderBy(desc(certificates.createdAt)).limit(200);
    return NextResponse.json({ certificates: list });
  } catch (e) {
    return errorResponse(e, "certificates-get");
  }
}

/** Certificates are WORKER-owned: only the worker generates or revokes them. */
export async function POST(request: Request) {
  try {
    const p = await requireWorker(request);
    const b = await readJson(request);
    const action = oneOf(b, "action", ["generate", "revoke"] as const, "generate");

    if (action === "revoke") {
      const [c] = await db.select().from(certificates).where(and(eq(certificates.id, uuid(b, "certificateId")!), eq(certificates.workerId, p.userId))).limit(1);
      if (!c) throw Errors.notFound("Certificate not found.", "प्रमाणपत्र नहीं मिला।");
      if (c.isRevoked) throw Errors.conflict("ALREADY_REVOKED", "Certificate is already revoked.");
      const [u] = await db.update(certificates).set({ isRevoked: true, revocationReason: str(b, "reason", { max: 300, required: false }) ?? "Revoked by worker" }).where(eq(certificates.id, c.id)).returning();
      await logAuditEvent({ actor: p, action: "CERTIFICATE_REVOKED", entityType: "certificate", entityId: c.id, details: u.revocationReason ?? undefined, scopeWorkerId: p.userId, scopeEmployerId: c.employerId, before: { isRevoked: false }, after: { isRevoked: true }, request });
      return NextResponse.json({ success: true, certificate: u });
    }

    const rel = await getOwnedRelationship(p, uuid(b, "relationshipId")!);
    if (rel.status !== "active" && rel.status !== "ended") throw Errors.conflict("RELATIONSHIP_NOT_ACTIVE", "No confirmed work relationship yet.", "अभी कोई पुष्ट कार्य संबंध नहीं है।");
    const today = new Date().toISOString().split("T")[0];
    const periodStart = isoDate(b, "periodStart") ?? `${today.slice(0, 7)}-01`;
    const periodEnd = isoDate(b, "periodEnd") ?? today;
    if (periodStart > periodEnd) throw Errors.invalid("periodStart must be before periodEnd.");

    const from = new Date(`${periodStart}T00:00:00.000Z`);
    const to = new Date(`${periodEnd}T23:59:59.999Z`);
    const sessions = await db.select().from(workSessions).where(and(eq(workSessions.relationshipId, rel.id), gte(workSessions.serverStartReceivedAt, from), lte(workSessions.serverStartReceivedAt, to)));
    const confirmed = sessions.filter((s) => s.status === "confirmed");
    const disputed = sessions.filter((s) => s.status === "disputed");
    if (confirmed.length === 0) throw Errors.conflict("NO_CONFIRMED_WORK", "No employer-confirmed work sessions in this period.", "इस अवधि में नियोक्ता द्वारा पुष्ट कोई कार्य सत्र नहीं है।");

    const totalMinutes = confirmed.reduce((a, s) => a + (s.durationMinutes || 0), 0);
    const expected = confirmed.reduce((a, s) => a + Number(s.calculatedWage || 0), 0);
    const paidRows = await db.select().from(payments).where(and(eq(payments.relationshipId, rel.id), eq(payments.status, "confirmed"), gte(payments.paymentDate, periodStart), lte(payments.paymentDate, periodEnd)));
    const paid = paidRows.reduce((a, r) => a + Number(r.amount), 0);

    const [agr] = await db.select().from(wageAgreements).where(eq(wageAgreements.relationshipId, rel.id)).orderBy(desc(wageAgreements.version)).limit(1);
    const [worker] = await db.select().from(users).where(eq(users.id, rel.workerId)).limit(1);
    const [employer] = await db.select().from(users).where(eq(users.id, rel.employerId)).limit(1);
    const [wp] = await db.select().from(workerProfiles).where(eq(workerProfiles.userId, rel.workerId)).limit(1);

    const status = disputed.length > 0 ? "Contains Disputed Sessions" : sessions.some((s) => s.status === "pending_confirmation") ? "Partially Confirmed" : "Fully Confirmed";
    const snapshot = {
      workerDisplayName: worker.name, employerDisplayName: employer.name, occupation: wp?.occupation || rel.roleTitle,
      periodStart, periodEnd, confirmedWorkdays: confirmed.length, confirmedHours: (totalMinutes / 60).toFixed(2),
      disputedSessionsCount: disputed.length, agreedWageRate: agr ? `₹${agr.wageAmount} / ${agr.wageType}` : "Not recorded",
      totalEarningsExpected: expected.toFixed(2), totalPaymentsReceived: paid.toFixed(2), outstandingAmount: Math.max(0, expected - paid).toFixed(2),
      certificateStatus: status,
    };
    const canonicalHash = generateCanonicalHash(snapshot);

    for (let attempt = 0; attempt < 5; attempt++) {
      const code = generateCertificateCode();
      try {
        const [cert] = await db.insert(certificates).values({ certificateNumber: code, workerId: rel.workerId, employerId: rel.employerId, relationshipId: rel.id, ...snapshot, canonicalHash, verificationUrl: `/verify/${code}` }).returning();
        await logAuditEvent({ actor: p, action: "CERTIFICATE_GENERATED", entityType: "certificate", entityId: cert.id, details: `${code} sha256=${canonicalHash.slice(0, 12)}…`, scopeWorkerId: p.userId, scopeEmployerId: rel.employerId, request });
        return NextResponse.json({ success: true, certificate: cert }, { status: 201 });
      } catch (e) {
        if (!isUniqueViolation(e)) throw e;
      }
    }
    throw Errors.conflict("CODE_COLLISION", "Could not allocate a certificate code. Please retry.");
  } catch (e) {
    return errorResponse(e, "certificates-post");
  }
}
