import { NextResponse } from "next/server";
import { desc, eq, and } from "drizzle-orm";
import { db } from "@/db";
import { certificates, verificationRecords, userConsents } from "@/db/schema";
import { generateCanonicalHash } from "@/lib/crypto";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { errorResponse } from "@/lib/errors";

export const dynamic = "force-dynamic";
const CODE_RE = /^KP-[A-Z0-9]{6,12}$/;

/** PUBLIC endpoint. Never returns phone, email, GPS, notes or any private worker data. */
export async function GET(request: Request, { params }: { params: Promise<{ certificateId: string }> }) {
  try {
    const ip = clientIp(request);
    await rateLimit(`verify:${ip}`, 60, 60 * 1000);
    const code = (await params).certificateId.toUpperCase().slice(0, 40);
    const ua = request.headers.get("user-agent")?.slice(0, 200) || "unknown";

    const [cert] = CODE_RE.test(code) ? await db.select().from(certificates).where(eq(certificates.certificateNumber, code)).limit(1) : [];
    if (!cert) {
      await db.insert(verificationRecords).values({ queriedId: code.slice(0, 40), outcome: "NOT_FOUND", integrityOk: false, requestIp: ip, userAgent: ua });
      return NextResponse.json({ found: false, outcome: "NOT_FOUND", error: "Certificate not found in the KaamProof registry." }, { status: 404 });
    }

    const snapshot = {
      workerDisplayName: cert.workerDisplayName, employerDisplayName: cert.employerDisplayName, occupation: cert.occupation,
      periodStart: cert.periodStart, periodEnd: cert.periodEnd, confirmedWorkdays: cert.confirmedWorkdays, confirmedHours: cert.confirmedHours,
      disputedSessionsCount: cert.disputedSessionsCount, agreedWageRate: cert.agreedWageRate, totalEarningsExpected: cert.totalEarningsExpected,
      totalPaymentsReceived: cert.totalPaymentsReceived, outstandingAmount: cert.outstandingAmount, certificateStatus: cert.certificateStatus,
    };
    const integrityValid = generateCanonicalHash(snapshot) === cert.canonicalHash;
    const outcome = cert.isRevoked ? "REVOKED" : integrityValid ? "VERIFIED" : "INTEGRITY_CHECK_FAILED";
    await db.insert(verificationRecords).values({ certificateId: cert.id, queriedId: code, outcome, integrityOk: integrityValid, requestIp: ip, userAgent: ua });

    if (outcome !== "VERIFIED") {
      // Do not show record contents for revoked / tampered certificates.
      return NextResponse.json({ found: true, outcome, integrityValid, isRevoked: cert.isRevoked, certificate: { certificateNumber: cert.certificateNumber, generatedAt: cert.createdAt } });
    }
    const [consent] = await db.select().from(userConsents).where(and(eq(userConsents.userId, cert.workerId), eq(userConsents.consentType, "certificate_public_verification"))).orderBy(desc(userConsents.acceptedAt)).limit(1);
    const showName = consent ? consent.isAccepted : true;
    return NextResponse.json({
      found: true, outcome, integrityValid: true, isRevoked: false,
      certificate: { ...snapshot, workerDisplayName: showName ? cert.workerDisplayName : "Name withheld by worker", certificateNumber: cert.certificateNumber, generatedAt: cert.createdAt, canonicalHash: cert.canonicalHash },
    });
  } catch (e) {
    return errorResponse(e, "verify");
  }
}
