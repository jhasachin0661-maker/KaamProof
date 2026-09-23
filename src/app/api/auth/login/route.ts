import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { DUMMY_HASH, createSession, publicUser, setSessionCookie, verifyPassword } from "@/lib/auth";
import { Errors, errorResponse } from "@/lib/errors";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { logAuditEvent } from "@/lib/audit";
import { readJson } from "@/lib/validate";

export async function POST(request: Request) {
  try {
    const ip = clientIp(request);
    await rateLimit(`login-ip:${ip}`, 30, 15 * 60 * 1000);
    const body = await readJson(request);
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase().slice(0, 254) : "";
    const password = typeof body.password === "string" ? body.password : "";
    if (!email || !password || password.length > 200) throw Errors.invalidCredentials();
    await rateLimit(`login-email:${email}`, 8, 15 * 60 * 1000);

    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    // Always run a bcrypt compare so response time does not reveal whether the account exists.
    const ok = await verifyPassword(password, user?.passwordHash ?? DUMMY_HASH);
    if (!user || !ok || !user.isActive || (user.role !== "worker" && user.role !== "employer")) throw Errors.invalidCredentials();

    const { token, expiresAt } = await createSession(user.id, request);
    const res = NextResponse.json({ success: true, user: publicUser({ userId: user.id, email: user.email, phone: user.phone, name: user.name, role: user.role as "worker" | "employer" }) });
    setSessionCookie(res, token, expiresAt);
    await logAuditEvent({ actorId: user.id, actorRole: user.role, action: "USER_LOGIN", entityType: "user", entityId: user.id, request });
    return res;
  } catch (e) {
    return errorResponse(e, "login");
  }
}
