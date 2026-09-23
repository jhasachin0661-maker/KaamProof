import { NextResponse } from "next/server";
import crypto from "crypto";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users, passwordResets } from "@/db/schema";
import { hashToken, assertSameOrigin } from "@/lib/auth";
import { errorResponse } from "@/lib/errors";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { logAuditEvent } from "@/lib/audit";
import { sendMail } from "@/lib/mailer";
import { readJson } from "@/lib/validate";

/** Always answers the same way so it can't be used to discover which emails are registered. */
export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    await rateLimit(`forgot-ip:${clientIp(request)}`, 10, 60 * 60 * 1000);
    const body = await readJson(request);
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase().slice(0, 254) : "";
    const generic = NextResponse.json({ success: true, message_en: "If that email is registered, a reset link has been sent.", message_hi: "यदि यह ईमेल पंजीकृत है, तो रीसेट लिंक भेज दिया गया है।" });
    if (!email) return generic;
    await rateLimit(`forgot-email:${email}`, 3, 60 * 60 * 1000);

    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (user && user.isActive) {
      const token = crypto.randomBytes(32).toString("base64url");
      await db.insert(passwordResets).values({ userId: user.id, tokenHash: hashToken(token), expiresAt: new Date(Date.now() + 30 * 60 * 1000) });
      const base = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
      await sendMail(email, "Reset your KaamProof password", `Use this link within 30 minutes to set a new password:\n${base}/reset-password?token=${token}\n\nIf you did not ask for this, ignore this email.`);
      await logAuditEvent({ actorId: user.id, actorRole: user.role, action: "PASSWORD_RESET_REQUESTED", entityType: "user", entityId: user.id, request });
    }
    return generic;
  } catch (e) {
    return errorResponse(e, "forgot");
  }
}
