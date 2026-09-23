import { NextResponse } from "next/server";
import { and, eq, gt, isNull } from "drizzle-orm";
import { db } from "@/db";
import { users, passwordResets, authSessions } from "@/db/schema";
import { assertSameOrigin, hashPassword, hashToken, validatePassword } from "@/lib/auth";
import { ApiError, errorResponse } from "@/lib/errors";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { logAuditEvent } from "@/lib/audit";
import { readJson } from "@/lib/validate";

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    await rateLimit(`reset-ip:${clientIp(request)}`, 20, 60 * 60 * 1000);
    const body = await readJson(request);
    const token = typeof body.token === "string" ? body.token.slice(0, 200) : "";
    const password = validatePassword(body.password);
    const invalid = new ApiError(400, "RESET_LINK_INVALID", "This reset link is invalid or has expired.", "यह रीसेट लिंक अमान्य है या समाप्त हो चुका है।");
    if (!token) throw invalid;

    const passwordHash = await hashPassword(password);
    const userId = await db.transaction(async (tx) => {
      // Consume the token atomically so it can only ever be used once.
      const [row] = await tx.update(passwordResets).set({ usedAt: new Date() })
        .where(and(eq(passwordResets.tokenHash, hashToken(token)), isNull(passwordResets.usedAt), gt(passwordResets.expiresAt, new Date()))).returning();
      if (!row) return null;
      await tx.update(users).set({ passwordHash, updatedAt: new Date() }).where(eq(users.id, row.userId));
      await tx.update(authSessions).set({ revoked: true }).where(eq(authSessions.userId, row.userId)); // log out everywhere
      return row.userId;
    });
    if (!userId) throw invalid;
    await logAuditEvent({ actorId: userId, action: "PASSWORD_RESET_COMPLETED", entityType: "user", entityId: userId, details: "All sessions revoked", request });
    return NextResponse.json({ success: true });
  } catch (e) {
    return errorResponse(e, "reset");
  }
}
