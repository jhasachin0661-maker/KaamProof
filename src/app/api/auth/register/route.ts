import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users, workerProfiles, employerProfiles } from "@/db/schema";
import { createSession, hashPassword, publicUser, setSessionCookie } from "@/lib/auth";
import { ApiError, errorResponse } from "@/lib/errors";
import { normalizePhone, readJson, str } from "@/lib/validate";

function validatePassword(password: string) {
  if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    throw new ApiError(400, "WEAK_PASSWORD", "Password must be at least 8 characters and include a letter and a number.");
  }
}

export async function POST(request: Request) {
  try {
    const body = await readJson(request);
    const phone = normalizePhone(str(body, "phone", { required: true })!);
    const password = str(body, "password", { min: 8, max: 128 })!;
    const confirmPassword = str(body, "confirmPassword", { min: 8, max: 128 })!;
    const name = str(body, "name", { min: 2, max: 80 })!;
    const role = str(body, "role", { required: true });
    if (role !== "worker" && role !== "employer") throw new ApiError(400, "ROLE_INVALID", "Role must be worker or employer.");
    if (password !== confirmPassword) throw new ApiError(400, "PASSWORD_MISMATCH", "Passwords do not match.");
    validatePassword(password);
    const [existing] = await db.select().from(users).where(eq(users.phone, phone)).limit(1);
    if (existing) throw new ApiError(409, "ACCOUNT_EXISTS", "An account already exists for this mobile number. Please log in.");
    const [user] = await db.insert(users).values({ phone, name, role, passwordHash: await hashPassword(password) }).returning();
    if (role === "worker") await db.insert(workerProfiles).values({ userId: user.id, occupation: "Worker", primaryLocation: "Not provided" });
    else await db.insert(employerProfiles).values({ userId: user.id, companyOrHouseholdName: name, category: "Household", addressCity: "Not provided" });
    const session = await createSession(user.id, request);
    const response = NextResponse.json({ user: publicUser({ userId: user.id, phone: user.phone, name: user.name, role: role as "worker" | "employer" }) });
    setSessionCookie(response, session.token, session.expiresAt);
    return response;
  } catch (error) {
    return errorResponse(error, "auth/register");
  }
}
