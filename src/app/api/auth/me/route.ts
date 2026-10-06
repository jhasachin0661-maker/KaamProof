import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users, workerProfiles, employerProfiles } from "@/db/schema";
import { getPrincipal, publicUser } from "@/lib/auth";
import { errorResponse } from "@/lib/errors";
import { logAuditEvent } from "@/lib/audit";
import { readJson, str, num } from "@/lib/validate";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const p = await getPrincipal(request);
    return NextResponse.json({ authenticated: true, user: publicUser(p), profile: p.profile });
  } catch (e) {
    return errorResponse(e, "me");
  }
}

/** Update own profile. Role, phone and ids can never be changed here. */
export async function PATCH(request: Request) {
  try {
    const p = await getPrincipal(request);
    const b = await readJson(request);
    const name = str(b, "name", { min: 2, max: 80, required: false });
    const phone = str(b, "phone", { min: 7, max: 20, required: false });
    if (name || phone) await db.update(users).set({ ...(name ? { name } : {}), ...(phone ? { phone } : {}), updatedAt: new Date() }).where(eq(users.id, p.userId));

    if (p.role === "worker") {
      const set = {
        occupation: str(b, "occupation", { max: 120, required: false }),
        primaryLocation: str(b, "primaryLocation", { max: 120, required: false }),
        bio: str(b, "bio", { max: 500, required: false }),
        upiClaimId: str(b, "upiClaimId", { max: 100, required: false }),
        experienceYears: num(b, "experienceYears", { min: 0, max: 70 }),
      };
      const clean = Object.fromEntries(Object.entries(set).filter(([, v]) => v !== undefined));
      if (Object.keys(clean).length) await db.update(workerProfiles).set(clean).where(eq(workerProfiles.userId, p.userId));
    } else {
      const set = {
        companyOrHouseholdName: str(b, "companyOrHouseholdName", { max: 120, required: false }),
        addressCity: str(b, "addressCity", { max: 120, required: false }),
        contactPerson: str(b, "contactPerson", { max: 80, required: false }),
      };
      const clean = Object.fromEntries(Object.entries(set).filter(([, v]) => v !== undefined));
      if (Object.keys(clean).length) await db.update(employerProfiles).set(clean).where(eq(employerProfiles.userId, p.userId));
    }
    await logAuditEvent({ actor: p, action: "PROFILE_UPDATED", entityType: "user", entityId: p.userId, details: "Profile fields updated", request });
    const fresh = await getPrincipal(request);
    return NextResponse.json({ success: true, user: publicUser(fresh), profile: fresh.profile });
  } catch (e) {
    return errorResponse(e, "me-patch");
  }
}
