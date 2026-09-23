import { NextResponse } from "next/server";
import { and, eq, ne } from "drizzle-orm";
import { db } from "@/db";
import { users, authSessions } from "@/db/schema";
import { getPrincipal, hashPassword, validatePassword, verifyPassword } from "@/lib/auth";
import { Errors, errorResponse } from "@/lib/errors";
import { rateLimit } from "@/lib/rate-limit";
import { logAuditEvent } from "@/lib/audit";
import { readJson } from "@/lib/validate";

/** Change password while logged in. Other devices are logged out; this session stays. */
export async function POST(request: Request) {
  try {
    const p = await getPrincipal(request);
    await rateLimit(`chpw:${p.userId}`, 5, 15 * 60 * 1000);
    const b = await readJson(request);
    const current = typeof b.currentPassword === "string" ? b.currentPassword : "";
    const next = validatePassword(b.newPassword);
    const [u] = await db.select().from(users).where(eq(users.id, p.userId)).limit(1);
    if (!u || !(await verifyPassword(current, u.passwordHash))) throw Errors.invalidCredentials();
    await db.update(users).set({ passwordHash: await hashPassword(next), updatedAt: new Date() }).where(eq(users.id, p.userId));
    await db.update(authSessions).set({ revoked: true }).where(and(eq(authSessions.userId, p.userId), ne(authSessions.id, p.sessionId)));
    await logAuditEvent({ actor: p, action: "PASSWORD_CHANGED", entityType: "user", entityId: p.userId, details: "Other sessions revoked", request });
    return NextResponse.json({ success: true });
  } catch (e) {
    return errorResponse(e, "password");
  }
}
