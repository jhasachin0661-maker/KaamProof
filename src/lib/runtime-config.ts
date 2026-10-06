/** Server-only runtime contract. Never import this from client components. */
const isProduction = process.env.APP_ENV === "production" || (process.env.NODE_ENV === "production" && process.env.NEXT_PHASE !== "phase-production-build");

export function assertRuntimeConfig() {
  const missing: string[] = [];
  if (!process.env.DATABASE_URL) missing.push("DATABASE_URL");
  if (isProduction && !process.env.SESSION_SECRET) missing.push("SESSION_SECRET");
  if (isProduction && process.env.APP_ENV !== "production") missing.push("APP_ENV=production");
  if (isProduction && process.env.DATABASE_TARGET !== "production") missing.push("DATABASE_TARGET=production");
  if (isProduction && process.env.ALLOW_DEMO_SEED === "true") missing.push("ALLOW_DEMO_SEED=false");
  if (missing.length) throw new Error(`Invalid production runtime configuration: ${missing.join(", ")}`);
}

assertRuntimeConfig();
