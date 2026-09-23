import { NextResponse } from "next/server";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { payments, disputes } from "@/db/schema";
import { getPrincipal } from "@/lib/auth";
import { getOwnedRelationship } from "@/lib/access";
import { Errors, errorResponse, isUniqueViolation } from "@/lib/errors";
import { logAuditEvent } from "@/lib/audit";
import { isoDate, num, oneOf, readJson, str, uuid } from "@/lib/validate";
import { ApiError } from "@/lib/errors";

export const dynamic = "force-dynamic";
const METHODS = ["Cash", "Direct Bank Transfer", "UPI", "Other"] as const;

function view(pay: typeof payments.$inferSelect) {
  const { idempotencyKey, ...rest } = pay;
  void idempotencyKey;
  return rest;
}

export async function GET(request: Request) {
  try {
    const p = await getPrincipal(request);
    const rows = await db.select().from(payments)
      .where(p.role === "worker" ? eq(payments.workerId, p.userId) : eq(payments.employerId, p.userId))
      .orderBy(desc(payments.createdAt)).limit(300);
    return NextResponse.json({ payments: rows.map(view) });
  } catch (e) {
    return errorResponse(e, "payments-get");
  }
}

export async function POST(request: Request) {
  try {
    const p = await getPrincipal(request);
    const b = await readJson(request);
    const action = oneOf(b, "action", ["create", "confirm", "dispute"] as const, "create");
    const now = new Date();

    if (action === "create") {
      const rel = await getOwnedRelationship(p, uuid(b, "relationshipId")!, { requireActive: true });
      const amount = num(b, "amount", { min: 1, max: 10_000_000, required: true })!;
      const paymentDate = isoDate(b, "paymentDate") ?? now.toISOString().split("T")[0];
      if (paymentDate > now.toISOString().split("T")[0]) throw Errors.invalid("Payment date cannot be in the future.", "भुगतान की तारीख भविष्य में नहीं हो सकती।");
      const rawKey = str(b, "idempotencyKey", { min: 8, max: 100, required: false });
      const key = rawKey ? `${p.userId}:${rawKey}` : null;
      if (key) {
        const [dup] = await db.select().from(payments).where(eq(payments.idempotencyKey, key)).limit(1);
        if (dup) return NextResponse.json({ success: true, payment: view(dup), duplicateIgnored: true });
      }
      try {
        // The RECORDER never confirms their own record — the other party must.
        const [pay] = await db.insert(payments).values({
          workerId: rel.workerId, employerId: rel.employerId, relationshipId: rel.id, amount: amount.toFixed(2), paymentDate,
          paymentMethod: oneOf(b, "paymentMethod", METHODS, "Cash"), referenceNote: str(b, "referenceNote", { max: 300, required: false }) ?? null,
          recordedByRole: p.role, workerConfirmation: p.role === "worker", employerConfirmation: p.role === "employer",
          status: "pending_confirmation", idempotencyKey: key,
        }).returning();
        await logAuditEvent({ actor: p, action: "PAYMENT_RECORDED", entityType: "payment", entityId: pay.id, details: `₹${pay.amount} recorded by ${p.role}; awaiting ${p.role === "worker" ? "employer" : "worker"} confirmation`, scopeWorkerId: rel.workerId, scopeEmployerId: rel.employerId, after: view(pay), request });
        return NextResponse.json({ success: true, payment: view(pay) }, { status: 201 });
      } catch (e) {
        if (key && isUniqueViolation(e)) {
          const [dup] = await db.select().from(payments).where(eq(payments.idempotencyKey, key)).limit(1);
          if (dup) return NextResponse.json({ success: true, payment: view(dup), duplicateIgnored: true });
        }
        throw e;
      }
    }

    // confirm / dispute: only the OTHER party of THIS payment
    const [pay] = await db.select().from(payments).where(eq(payments.id, uuid(b, "paymentId")!)).limit(1);
    if (!pay || (p.role === "worker" ? pay.workerId : pay.employerId) !== p.userId) throw Errors.notFound("Payment not found.", "भुगतान नहीं मिला।");
    if (pay.recordedByRole === p.role) throw Errors.forbidden("The other party must respond to a payment you recorded.", "आपके द्वारा दर्ज भुगतान पर दूसरे पक्ष को उत्तर देना होगा।");
    if (pay.status === "confirmed") throw new ApiError(409, "PAYMENT_ALREADY_CONFIRMED", "This payment is already confirmed.", "यह भुगतान पहले ही पुष्ट हो चुका है।");
    if (pay.status !== "pending_confirmation") throw Errors.conflict("PAYMENT_NOT_PENDING", "This payment is not waiting for a response.");

    if (action === "confirm") {
      const [u] = await db.update(payments).set({ workerConfirmation: true, employerConfirmation: true, status: "confirmed", confirmedAt: now })
        .where(and(eq(payments.id, pay.id), eq(payments.status, "pending_confirmation"))).returning();
      if (!u) throw new ApiError(409, "PAYMENT_ALREADY_CONFIRMED", "This payment is already confirmed.");
      await logAuditEvent({ actor: p, action: "PAYMENT_CONFIRMED", entityType: "payment", entityId: u.id, details: `₹${u.amount} confirmed by ${p.role}`, scopeWorkerId: u.workerId, scopeEmployerId: u.employerId, before: { status: pay.status }, after: { status: u.status }, request });
      return NextResponse.json({ success: true, payment: view(u) });
    }

    const reason = str(b, "description", { min: 3, max: 500, required: false }) ?? "Payment record disputed.";
    const u = await db.transaction(async (tx) => {
      const [x] = await tx.update(payments).set({ status: "disputed" }).where(and(eq(payments.id, pay.id), eq(payments.status, "pending_confirmation"))).returning();
      if (!x) return null;
      await tx.insert(disputes).values({ raisedByUserId: p.userId, workerId: x.workerId, employerId: x.employerId, paymentId: x.id, reasonCategory: "missing_payment", description: reason, status: "open" });
      return x;
    });
    if (!u) throw Errors.conflict("PAYMENT_NOT_PENDING", "This payment is not waiting for a response.");
    await logAuditEvent({ actor: p, action: "PAYMENT_DISPUTED", entityType: "payment", entityId: u.id, details: reason, scopeWorkerId: u.workerId, scopeEmployerId: u.employerId, before: { status: pay.status }, after: { status: u.status }, request });
    return NextResponse.json({ success: true, payment: view(u) });
  } catch (e) {
    return errorResponse(e, "payments-post");
  }
}
