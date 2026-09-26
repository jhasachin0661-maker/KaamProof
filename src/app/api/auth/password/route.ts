import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { authSessions, users } from "@/db/schema";
import { getPrincipal, hashPassword, hashToken, readCookie, SESSION_COOKIE, verifyPassword } from "@/lib/auth";
import { ApiError, errorResponse } from "@/lib/errors";
import { readJson, str } from "@/lib/validate";

export async function POST(request: Request) {
  try {
    const principal = await getPrincipal(request);
    const body = await readJson(request);
    const currentPassword = str(body, "currentPassword", { min: 1, max: 128 })!;
    const newPassword = str(body, "newPassword", { min: 8, max: 128 })!;
    if (newPassword.length < 8 || !/[A-Za-z]/.test(newPassword) || !/\d/.test(newPassword)) {
      throw new ApiError(400, "WEAK_PASSWORD", "Password must be at least 8 characters and include a letter and a number.");
    }
    const [user] = await db.select().from(users).where(eq(users.id, principal.userId)).limit(1);
    if (!user || !(await verifyPassword(currentPassword, user.passwordHash))) throw new ApiError(401, "INVALID_PASSWORD", "Current password is incorrect.");
    await db.update(users).set({ passwordHash: await hashPassword(newPassword), updatedAt: new Date() }).where(eq(users.id, principal.userId));
    const currentToken = readCookie(request, SESSION_COOKIE);
    if (currentToken) await db.update(authSessions).set({ revoked: true }).where(eq(authSessions.userId, principal.userId));
    if (currentToken) await db.insert(authSessions).values({ userId: principal.userId, tokenHash: hashToken(currentToken), expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), revoked: false });
    return NextResponse.json({ success: true });
  } catch (error) {
    return errorResponse(error, "auth/password");
  }
}
