import { Errors } from "./errors";

/**
 * Rate limiter.
 *  - If UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN are set, limits are SHARED across all instances
 *    (required on Vercel / any multi-instance deployment).
 *  - Otherwise it falls back to an in-memory fixed window (fine for one local process only).
 * If Upstash is configured but temporarily unreachable we fall back to memory rather than blocking logins.
 */
const buckets = new Map<string, { count: number; resetAt: number }>();

function memoryLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) if (v.resetAt <= now) buckets.delete(k);
  }
  const b = buckets.get(key);
  if (!b || b.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  b.count += 1;
  return b.count <= limit;
}

async function redisLimit(key: string, limit: number, windowMs: number): Promise<boolean | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  try {
    const k = `kp:rl:${key}`;
    const res = await fetch(`${url}/pipeline`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify([["INCR", k], ["PEXPIRE", k, String(windowMs), "NX"]]),
      signal: AbortSignal.timeout(1500),
    });
    if (!res.ok) return null;
    const out = (await res.json()) as Array<{ result?: number }>;
    return (out[0]?.result ?? 0) <= limit;
  } catch {
    return null;
  }
}

export async function rateLimit(key: string, limit: number, windowMs: number) {
  const shared = await redisLimit(key, limit, windowMs);
  const ok = shared ?? memoryLimit(key, limit, windowMs);
  if (!ok) throw Errors.rateLimited();
}

export function clientIp(request: Request): string {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim().slice(0, 64);
  return request.headers.get("x-real-ip")?.slice(0, 64) || "unknown";
}
