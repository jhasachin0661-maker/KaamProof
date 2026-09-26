import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { createSession, publicUser, setSessionCookie, verifyPassword } from "@/lib/auth";
import { errorResponse, Errors, ApiError } from "@/lib/errors";
import { normalizePhone, readJson, str } from "@/lib/validate";

export async function POST(request: Request) {
  try {
    const body = await readJson(request);
    const phone = normalizePhone(str(body, "phone", { required: true })!);
    const password = str(body, "password", { min: 1, max: 128 })!;
    const role = str(body, "role", { required: true });
    if (role !== "worker" && role !== "employer") throw new ApiError(400, "ROLE_INVALID", "Role must be worker or employer.");
    const [user] = await db.select().from(users).where(eq(users.phone, phone)).limit(1);
    if (!user || user.role !== role || !(await verifyPassword(password, user.passwordHash))) throw Errors.invalidCredentials();
    const session = await createSession(user.id, request);
    const response = NextResponse.json({ user: publicUser({ userId: user.id, email: user.email, phone: user.phone, name: user.name, role: user.role as "worker" | "employer" }) });
    setSessionCookie(response, session.token, session.expiresAt);
    return response;
  } catch (error) {
    return errorResponse(error, "auth/login");
  }
}
