import { NextResponse } from "next/server";
import { and, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { workSessions, payments, employmentRelationships, disputes, anomalyScores, certificates } from "@/db/schema";
import { getPrincipal } from "@/lib/auth";
import { errorResponse } from "@/lib/errors";

export const dynamic = "force-dynamic";
const n = (v: unknown) => Number(v ?? 0);

export async function GET(request: Request) {
  try {
    const p = await getPrincipal(request);

    if (p.role === "worker") {
      const [s] = await db.select({
        confirmedWorkdays: sql<number>`count(*) filter (where ${workSessions.status} = 'confirmed')`,
        confirmedMinutes: sql<number>`coalesce(sum(${workSessions.durationMinutes}) filter (where ${workSessions.status} = 'confirmed'), 0)`,
        expected: sql<string>`coalesce(sum(${workSessions.calculatedWage}) filter (where ${workSessions.status} = 'confirmed'), 0)`,
        pending: sql<number>`count(*) filter (where ${workSessions.status} = 'pending_confirmation')`,
        disputed: sql<number>`count(*) filter (where ${workSessions.status} = 'disputed')`,
      }).from(workSessions).where(eq(workSessions.workerId, p.userId));
      const [pay] = await db.select({ paid: sql<string>`coalesce(sum(${payments.amount}) filter (where ${payments.status} = 'confirmed'), 0)` }).from(payments).where(eq(payments.workerId, p.userId));
      const [active] = await db.select().from(workSessions).where(and(eq(workSessions.workerId, p.userId), eq(workSessions.status, "open"))).limit(1);
      const expectedEarnings = Number(s.expected);
      const paidAmount = Number(pay.paid);
      return NextResponse.json({
        confirmedWorkdays: n(s.confirmedWorkdays), confirmedHours: (n(s.confirmedMinutes) / 60).toFixed(1),
        expectedEarnings, paidAmount, outstandingAmount: Math.max(0, expectedEarnings - paidAmount),
        pendingCount: n(s.pending), disputedCount: n(s.disputed),
        activeSession: active ? (({ idempotencyKey, ...rest }) => { void idempotencyKey; return rest; })(active) : null,
      });
    }

    // Employer: EVERY number is scoped to this employer's own relationships/records.
    const me = p.userId;
    const [s] = await db.select({
      total: sql<number>`count(*)`,
      pending: sql<number>`count(*) filter (where ${workSessions.status} = 'pending_confirmation')`,
      confirmed: sql<number>`count(*) filter (where ${workSessions.status} = 'confirmed')`,
      disputed: sql<number>`count(*) filter (where ${workSessions.status} = 'disputed')`,
      today: sql<number>`count(*) filter (where ${workSessions.serverStartReceivedAt} >= date_trunc('day', now()))`,
    }).from(workSessions).where(eq(workSessions.employerId, me));
    const [pay] = await db.select({
      disbursed: sql<string>`coalesce(sum(${payments.amount}) filter (where ${payments.status} = 'confirmed'), 0)`,
      pending: sql<number>`count(*) filter (where ${payments.status} = 'pending_confirmation')`,
    }).from(payments).where(eq(payments.employerId, me));
    const [rel] = await db.select({
      active: sql<number>`count(*) filter (where ${employmentRelationships.status} = 'active')`,
      requests: sql<number>`count(*) filter (where ${employmentRelationships.status} = 'pending')`,
    }).from(employmentRelationships).where(eq(employmentRelationships.employerId, me));
    const [dis] = await db.select({ open: sql<number>`count(*) filter (where ${disputes.status} in ('open','under_review'))` }).from(disputes).where(eq(disputes.employerId, me));
    const [an] = await db.select({ pending: sql<number>`count(*) filter (where ${anomalyScores.humanReviewStatus} = 'pending_review')` }).from(anomalyScores).where(eq(anomalyScores.employerId, me));
    const [cert] = await db.select({ c: sql<number>`count(*)` }).from(certificates).where(eq(certificates.employerId, me));

    return NextResponse.json({
      totalSessions: n(s.total), pendingCount: n(s.pending), confirmedCount: n(s.confirmed), disputedCount: n(s.disputed),
      totalDisbursed: Number(pay.disbursed), activeWorkersCount: n(rel.active),
      overview: {
        activeWorkers: n(rel.active), pendingRequests: n(rel.requests), todaySessions: n(s.today), pendingConfirmations: n(s.pending),
        pendingPayments: n(pay.pending), openDisputes: n(dis.open), certificatesIssued: n(cert.c), anomalyReviews: n(an.pending),
      },
    });
  } catch (e) {
    return errorResponse(e, "metrics");
  }
}
