import crypto from "crypto";

function sortDeep(v: unknown): unknown {
  if (Array.isArray(v)) return v.map(sortDeep);
  if (v && typeof v === "object") {
    const o = v as Record<string, unknown>;
    return Object.keys(o).sort().reduce<Record<string, unknown>>((acc, k) => {
      acc[k] = sortDeep(o[k]);
      return acc;
    }, {});
  }
  return v;
}

/** SHA-256 over a canonical (deep key-sorted) JSON serialisation. */
export function generateCanonicalHash(data: Record<string, unknown>): string {
  return crypto.createHash("sha256").update(JSON.stringify(sortDeep(data))).digest("hex");
}

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I
/** Unguessable public certificate code, e.g. KP-7H3K9QX2 (32^8 ≈ 1.1e12 possibilities). */
export function generateCertificateCode(): string {
  let s = "";
  for (let i = 0; i < 8; i++) s += ALPHABET[crypto.randomInt(ALPHABET.length)];
  return `KP-${s}`;
}
