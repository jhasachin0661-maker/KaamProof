import { Errors } from "./errors";

export type Body = Record<string, unknown>;

/** Reads a JSON object body (max ~64KB). Throws a structured 400 on anything else. */
export async function readJson(request: Request): Promise<Body> {
  let text = "";
  try {
    text = await request.text();
  } catch {
    throw Errors.invalid("Could not read request body.");
  }
  if (text.length > 65536) throw Errors.invalid("Request body too large.");
  try {
    const parsed: unknown = JSON.parse(text || "{}");
    if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("not object");
    return parsed as Body;
  } catch {
    throw Errors.invalid("Request body must be a JSON object.");
  }
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function str(b: Body, key: string, opts: { min?: number; max?: number; required?: boolean } = {}): string | undefined {
  const { min = 1, max = 500, required = true } = opts;
  const v = b[key];
  if (v === undefined || v === null || v === "") {
    if (required) throw Errors.invalid(`${key} is required.`);
    return undefined;
  }
  if (typeof v !== "string") throw Errors.invalid(`${key} must be text.`);
  const t = v.trim();
  if (t.length < min || t.length > max) throw Errors.invalid(`${key} must be ${min}-${max} characters.`);
  return t;
}

export function uuid(b: Body, key: string, required = true): string | undefined {
  const v = b[key];
  if (v === undefined || v === null || v === "") {
    if (required) throw Errors.invalid(`${key} is required.`);
    return undefined;
  }
  if (typeof v !== "string" || !UUID_RE.test(v)) throw Errors.invalid(`${key} is not a valid id.`);
  return v;
}

export function oneOf<T extends string>(b: Body, key: string, allowed: readonly T[], fallback?: T): T {
  const v = b[key];
  if ((v === undefined || v === null || v === "") && fallback !== undefined) return fallback;
  if (typeof v !== "string" || !(allowed as readonly string[]).includes(v)) {
    throw Errors.invalid(`${key} must be one of: ${allowed.join(", ")}.`);
  }
  return v as T;
}

export function num(b: Body, key: string, opts: { min: number; max: number; required?: boolean }): number | undefined {
  const v = b[key];
  if (v === undefined || v === null || v === "") {
    if (opts.required) throw Errors.invalid(`${key} is required.`);
    return undefined;
  }
  const n = typeof v === "number" ? v : typeof v === "string" ? Number(v) : NaN;
  if (!Number.isFinite(n) || n < opts.min || n > opts.max) {
    throw Errors.invalid(`${key} must be a number between ${opts.min} and ${opts.max}.`);
  }
  return n;
}

export function isoDate(b: Body, key: string): string | undefined {
  const v = b[key];
  if (v === undefined || v === null || v === "") return undefined;
  if (typeof v !== "string" || !DATE_RE.test(v) || Number.isNaN(Date.parse(v))) {
    throw Errors.invalid(`${key} must be a date in YYYY-MM-DD format.`);
  }
  return v;
}

export function dateTime(b: Body, key: string): Date | undefined {
  const v = b[key];
  if (v === undefined || v === null || v === "") return undefined;
  const d = new Date(typeof v === "string" || typeof v === "number" ? v : NaN);
  if (Number.isNaN(d.getTime())) throw Errors.invalid(`${key} must be a valid timestamp.`);
  return d;
}

export function normalizeEmail(raw: string): string {
  const e = raw.trim().toLowerCase();
  if (e.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) throw Errors.invalid("Enter a valid email address.", "कृपया सही ईमेल दर्ज करें।");
  return e;
}

export function normalizePhone(raw: string): string {
  let p = raw.replace(/\D/g, "");
  // Assume Indian mobile number if 10 digits
  if (p.length === 10) p = "91" + p;
  if (!p.startsWith("91") || p.length !== 12) throw Errors.invalid("Enter a valid 10-digit mobile number.", "कृपया सही 10-अंकीय मोबाइल नंबर दर्ज करें।");
  return "+" + p;
}
