import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users, workerProfiles, employerProfiles, userConsents } from "@/db/schema";
import { createSession, hashPassword, publicUser, setSessionCookie, validatePassword } from "@/lib/auth";
import { ApiError, Errors, errorResponse, isUniqueViolation } from "@/lib/errors";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { logAuditEvent } from "@/lib/audit";
import { normalizeEmail, readJson, str } from "@/lib/validate";

export async function POST(request: Request) {
  try {
    await rateLimit(`register:${clientIp(request)}`, 10, 60 * 60 * 1000);
    const body = await readJson(request);

    // Only worker/employer can self-register. Anything else (admin, ngo_coordinator, ...) is rejected outright.
    const role = body.role ?? "worker";
    if (role !== "worker" && role !== "employer") {
      throw new ApiError(400, "ROLE_NOT_ALLOWED", "Only worker or employer accounts can be created.", "केवल श्रमिक या नियोक्ता खाता बनाया जा सकता है।");
    }
    const name = str(body, "name", { min: 2, max: 80 })!;
    const email = normalizeEmail(str(body, "email", { max: 254 })!);
    const password = validatePassword(body.password);
    const phone = str(body, "phone", { min: 7, max: 20, required: false }) ?? null;
    const city = str(body, "locationCity", { max: 80, required: false }) ?? "Not specified";
    const detail = str(body, "occupationOrCompany", { max: 120, required: false });

    const passwordHash = await hashPassword(password);

    let user;
    try {
      user = await db.transaction(async (tx) => {
        const [u] = await tx.insert(users).values({ email, passwordHash, phone, name, role }).returning();
        if (role === "worker") {
          await tx.insert(workerProfiles).values({ userId: u.id, occupation: detail || "Worker", primaryLocation: city, preferredLang: "hi" });
          await tx.insert(userConsents).values([
            { userId: u.id, consentType: "location_capture", version: "v1.0", isAccepted: true },
            { userId: u.id, consentType: "data_processing", version: "v1.0", isAccepted: true },
            { userId: u.id, consentType: "certificate_public_verification", version: "v1.0", isAccepted: true },
          ]);
        } else {
          await tx.insert(employerProfiles).values({ userId: u.id, companyOrHouseholdName: detail || `${name} (Household)`, category: "Household / Business", addressCity: city, contactPerson: name });
        }
        return u;
      });
    } catch (e) {
      if (isUniqueViolation(e)) throw Errors.conflict("EMAIL_TAKEN", "This email or phone is already registered. Please log in.", "यह ईमेल या फ़ोन पहले से पंजीकृत है। कृपया लॉगिन करें।");
      throw e;
    }

    const { token, expiresAt } = await createSession(user.id, request);
    const res = NextResponse.json({ success: true, user: publicUser({ userId: user.id, email, phone, name, role }) }, { status: 201 });
    setSessionCookie(res, token, expiresAt);
    await logAuditEvent({ actorId: user.id, actorRole: role, action: "USER_REGISTERED", entityType: "user", entityId: user.id, details: `New ${role} account registered`, request });
    return res;
  } catch (e) {
    return errorResponse(e, "register");
  }
}
