import { NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { and, eq, gt } from "drizzle-orm";
import { db } from "@/db";
import { users, workerProfiles, employerProfiles, authSessions } from "@/db/schema";
import { ApiError, Errors } from "./errors";

export type Role = "worker" | "employer";

export interface Principal {
  userId: string;
  email: string | null;
  phone: string;
  name: string;
  role: Role;
  profile: Record<string, unknown> | null;
  sessionId: string;
}

export const SESSION_COOKIE = "kp_session";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;
export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, passwordHash: string | null) {
  return Boolean(passwordHash) && bcrypt.compare(password, passwordHash!);
}

/* ---------- sessions (opaque token in HttpOnly cookie; only its SHA-256 is stored) ---------- */
export const hashToken = (token: string) => crypto.createHash("sha256").update(token).digest("hex");

export async function createSession(userId: string, request: Request) {
  const token = crypto.randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  await db.insert(authSessions).values({
    userId,
    tokenHash: hashToken(token),
    expiresAt,
    revoked: false,
    ipAddress: request.headers.get("x-forwarded-for")?.split(",")[0].trim().slice(0, 64) || null,
    userAgent: request.headers.get("user-agent")?.slice(0, 200) || null,
  });
  return { token, expiresAt };
}

export function setSessionCookie(res: NextResponse, token: string, expiresAt: Date) {
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}
export function clearSessionCookie(res: NextResponse) {
  res.cookies.set(SESSION_COOKIE, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 0 });
}

export function readCookie(request: Request, name: string): string | null {
  const header = request.headers.get("cookie");
  if (!header) return null;
  for (const part of header.split(";")) {
    const idx = part.indexOf("=");
    if (idx === -1) continue;
    if (part.slice(0, idx).trim() === name) return decodeURIComponent(part.slice(idx + 1).trim());
  }
  return null;
}

export async function revokeSession(request: Request) {
  const token = readCookie(request, SESSION_COOKIE);
  if (token) await db.update(authSessions).set({ revoked: true }).where(eq(authSessions.tokenHash, hashToken(token)));
}

/** CSRF defence in depth (on top of SameSite=Lax): reject cross-site browser mutations. */
export function assertSameOrigin(request: Request) {
  if (request.method === "GET" || request.method === "HEAD" || request.method === "OPTIONS") return;
  const site = request.headers.get("sec-fetch-site");
  if (site === "cross-site") throw new ApiError(403, "CSRF_BLOCKED", "Cross-site request blocked.");
  const origin = request.headers.get("origin");
  if (origin) {
    const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
    let originHost = "";
    try { originHost = new URL(origin).host; } catch { /* invalid */ }
    if (!host || originHost !== host) throw new ApiError(403, "CSRF_BLOCKED", "Cross-site request blocked.");
  }
}

/** Identity ALWAYS comes from the session cookie. Nothing from the request body/query is trusted. */
export async function getPrincipal(request: Request): Promise<Principal> {
  assertSameOrigin(request);
  const token = readCookie(request, SESSION_COOKIE);
  if (!token) throw Errors.authRequired();

  const [row] = await db
    .select({ session: authSessions, user: users })
    .from(authSessions)
    .innerJoin(users, eq(users.id, authSessions.userId))
    .where(and(eq(authSessions.tokenHash, hashToken(token)), eq(authSessions.revoked, false), gt(authSessions.expiresAt, new Date())))
    .limit(1);
  if (!row || !row.user.isActive) throw new ApiError(401, "SESSION_INVALID", "Your session has expired. Please log in again.", "आपका सत्र समाप्त हो गया है। कृपया पुनः लॉगिन करें।");
  if (row.user.role !== "worker" && row.user.role !== "employer") throw Errors.forbidden();

  const role = row.user.role as Role;
  const table = role === "worker" ? workerProfiles : employerProfiles;
  const [profile] = await db.select().from(table).where(eq(table.userId, row.user.id)).limit(1);

  return {
    userId: row.user.id,
    email: row.user.email,
    phone: row.user.phone,
    name: row.user.name,
    role,
    profile: (profile as Record<string, unknown>) ?? null,
    sessionId: row.session.id,
  };
}

export async function requireWorker(request: Request): Promise<Principal> {
  const p = await getPrincipal(request);
  if (p.role !== "worker") throw Errors.forbidden("Only workers can do this.", "केवल श्रमिक ही यह कर सकते हैं।");
  return p;
}
export async function requireEmployer(request: Request): Promise<Principal> {
  const p = await getPrincipal(request);
  if (p.role !== "employer") throw Errors.forbidden("Only employers can do this.", "केवल नियोक्ता ही यह कर सकते हैं।");
  return p;
}

export const publicUser = (p: Pick<Principal, "userId" | "email" | "phone" | "name" | "role">) => ({
  id: p.userId,
  email: p.email,
  phone: p.phone,
  name: p.name,
  role: p.role,
});
