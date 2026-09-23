import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { users, workerProfiles, employerProfiles, employmentRelationships, wageAgreements, workSessions, payments, disputes, certificates } from "@/db/schema";
import { getPrincipal } from "@/lib/auth";
import { errorResponse } from "@/lib/errors";
import { forEmployer, forWorker } from "@/lib/session-view";
import { logAuditEvent } from "@/lib/audit";

export const dynamic = "force-dynamic";

/** Cookie-authenticated only (no token in URL). Workers get their own data; employers get data scoped to their own relationships. */
export async function GET(request: Request) {
  try {
    const p = await getPrincipal(request);
    const isWorker = p.role === "worker";
    const me = p.userId;

    const [user] = await db.select({ id: users.id, name: users.name, email: users.email, phone: users.phone }).from(users).where(eq(users.id, p.userId)).limit(1);
    const [profile] = isWorker
      ? await db.select().from(workerProfiles).where(eq(workerProfiles.userId, p.userId)).limit(1)
      : await db.select().from(employerProfiles).where(eq(employerProfiles.userId, p.userId)).limit(1);

    const [rels, agreements, sessions, pays, disp, certs] = await Promise.all([
      db.select().from(employmentRelationships).where(isWorker ? eq(employmentRelationships.workerId, me) : eq(employmentRelationships.employerId, me)),
      db.select().from(wageAgreements).where(isWorker ? eq(wageAgreements.workerId, me) : eq(wageAgreements.employerId, me)),
      db.select().from(workSessions).where(isWorker ? eq(workSessions.workerId, me) : eq(workSessions.employerId, me)).orderBy(desc(workSessions.createdAt)),
      db.select().from(payments).where(isWorker ? eq(payments.workerId, me) : eq(payments.employerId, me)),
      db.select().from(disputes).where(isWorker ? eq(disputes.workerId, me) : eq(disputes.employerId, me)),
      db.select().from(certificates).where(isWorker ? eq(certificates.workerId, me) : eq(certificates.employerId, me)),
    ]);

    const payload = {
      app: "KaamProof", version: "2.0", scope: isWorker ? "worker_own_data" : "employer_scoped_data", exportedAt: new Date().toISOString(),
      account: { ...user, role: p.role }, profile,
      employmentRelationships: rels, wageAgreements: agreements,
      workSessions: isWorker ? sessions.map(forWorker) : sessions.map(forEmployer), payments: pays.map(({ idempotencyKey, ...r }) => (void idempotencyKey, r)),
      disputes: disp, certificates: certs,
    };
    await logAuditEvent({ actor: p, action: "DATA_EXPORTED", entityType: "user", entityId: p.userId, scopeWorkerId: isWorker ? p.userId : null, scopeEmployerId: isWorker ? null : p.userId, request });
    return new NextResponse(JSON.stringify(payload, null, 2), {
      headers: { "Content-Type": "application/json", "Content-Disposition": `attachment; filename="kaamproof-export-${p.role}.json"`, "Cache-Control": "no-store" },
    });
  } catch (e) {
    return errorResponse(e, "export");
  }
}
