import { NextResponse } from "next/server";
import { and, desc, eq, inArray, or } from "drizzle-orm";
import { db } from "@/db";
import { anomalyScores, auditLogs, users, workSessions, verificationRecords, certificates } from "@/db/schema";
import { requireEmployer } from "@/lib/auth";
import { Errors, errorResponse } from "@/lib/errors";
import { logAuditEvent } from "@/lib/audit";
import { oneOf, readJson, str, uuid } from "@/lib/validate";

export const dynamic = "force-dynamic";

/**
 * Employer-scoped review queue + audit trail. There is NO global admin: every query is filtered to the caller.
 * Anomaly scores are REVIEW SIGNALS only — they never decide who is telling the truth.
 */
export async function GET(request: Request) {
  try {
    const p = await requireEmployer(request);
    const type = new URL(request.url).searchParams.get("type") || "anomalies";

    if (type === "audit") {
      const logs = await db.select({
        id: auditLogs.id, action: auditLogs.action, entityType: auditLogs.entityType, entityId: auditLogs.entityId, details: auditLogs.details,
        actorId: auditLogs.actorId, actorRole: auditLogs.actorRole, beforeData: auditLogs.beforeData, afterData: auditLogs.afterData, createdAt: auditLogs.createdAt,
      }).from(auditLogs).where(or(eq(auditLogs.scopeEmployerId, p.userId), eq(auditLogs.actorId, p.userId))).orderBy(desc(auditLogs.createdAt)).limit(100);
      const verifications = await db.select({
        id: verificationRecords.id, queriedId: verificationRecords.queriedId, outcome: verificationRecords.outcome, verifiedAt: verificationRecords.verifiedAt,
      }).from(verificationRecords).innerJoin(certificates, eq(certificates.id, verificationRecords.certificateId)).where(eq(certificates.employerId, p.userId)).orderBy(desc(verificationRecords.verifiedAt)).limit(30);
      return NextResponse.json({ logs, verifications });
    }

    const rows = await db.select().from(anomalyScores).where(eq(anomalyScores.employerId, p.userId)).orderBy(desc(anomalyScores.createdAt)).limit(100);
    const workerIds = [...new Set(rows.map((a) => a.workerId))];
    const sessionIds = rows.map((a) => a.sessionId);
    const [ws, ss] = await Promise.all([
      workerIds.length ? db.select({ id: users.id, name: users.name }).from(users).where(inArray(users.id, workerIds)) : [],
      sessionIds.length ? db.select({ id: workSessions.id, status: workSessions.status, durationMinutes: workSessions.durationMinutes }).from(workSessions).where(inArray(workSessions.id, sessionIds)) : [],
    ]);
    const wm = new Map(ws.map((w) => [w.id, w.name]));
    const sm = new Map(ss.map((s) => [s.id, s]));
    return NextResponse.json({
      note: "Review signals help prioritise which records to look at. They are not findings about anyone's honesty.",
      anomalies: rows.map((a) => ({ ...a, workerName: wm.get(a.workerId) || "Worker", employerName: p.name, sessionStatus: sm.get(a.sessionId)?.status, durationMinutes: sm.get(a.sessionId)?.durationMinutes })),
    });
  } catch (e) {
    return errorResponse(e, "review-get");
  }
}

export async function POST(request: Request) {
  try {
    const p = await requireEmployer(request);
    const b = await readJson(request);
    const decision = oneOf(b, "decision", ["confirmed_normal", "flagged_investigation", "dismissed"] as const);
    const notes = str(b, "adminNotes", { max: 500, required: false });
    const [before] = await db.select().from(anomalyScores).where(and(eq(anomalyScores.id, uuid(b, "anomalyId")!), eq(anomalyScores.employerId, p.userId))).limit(1);
    if (!before) throw Errors.notFound("Review signal not found.");
    const [u] = await db.update(anomalyScores).set({ humanReviewStatus: decision, adminNotes: notes ?? `Reviewed by ${p.name}`, reviewedAt: new Date(), reviewedByUserId: p.userId }).where(eq(anomalyScores.id, before.id)).returning();
    await logAuditEvent({ actor: p, action: "ANOMALY_REVIEWED", entityType: "anomaly_score", entityId: u.id, details: `${decision}${notes ? `: ${notes}` : ""}`, scopeWorkerId: u.workerId, scopeEmployerId: p.userId, before: { status: before.humanReviewStatus }, after: { status: u.humanReviewStatus }, request });
    return NextResponse.json({ success: true, anomaly: u });
  } catch (e) {
    return errorResponse(e, "review-post");
  }
}
