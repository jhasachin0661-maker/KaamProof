import { NextResponse } from "next/server";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { userConsents } from "@/db/schema";
import { requireWorker } from "@/lib/auth";
import { errorResponse } from "@/lib/errors";
import { logAuditEvent } from "@/lib/audit";
import { oneOf, readJson } from "@/lib/validate";

export const dynamic = "force-dynamic";
const TYPES = ["location_capture", "certificate_public_verification", "data_processing"] as const;

export async function GET(request: Request) {
  try {
    const p = await requireWorker(request);
    const rows = await db.select().from(userConsents).where(eq(userConsents.userId, p.userId)).orderBy(desc(userConsents.acceptedAt));
    const latest: Record<string, boolean> = {};
    for (const r of rows) if (!(r.consentType in latest)) latest[r.consentType] = r.isAccepted;
    return NextResponse.json({ consents: latest });
  } catch (e) {
    return errorResponse(e, "consents");
  }
}

export async function POST(request: Request) {
  try {
    const p = await requireWorker(request);
    const b = await readJson(request);
    const consentType = oneOf(b, "consentType", TYPES);
    const isAccepted = b.isAccepted === true;
    await db.insert(userConsents).values({ userId: p.userId, consentType, isAccepted, version: "v1.0" });
    await logAuditEvent({ actor: p, action: "CONSENT_CHANGED", entityType: "consent", entityId: p.userId, details: `${consentType} -> ${isAccepted}`, scopeWorkerId: p.userId, request });
    return NextResponse.json({ success: true, consentType, isAccepted });
  } catch (e) {
    return errorResponse(e, "consents");
  }
}
