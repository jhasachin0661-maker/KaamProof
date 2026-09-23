import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required");
}

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
};

export const pool =
  globalForDb.__arenaNextJsPostgresqlPool ??
  new Pool({
    connectionString: databaseUrl,
    // Small pool: safe for serverless (Vercel) + Supabase pooler. Raise for long-running servers.
    max: Number(process.env.DB_POOL_MAX || 5),
  });

globalForDb.__arenaNextJsPostgresqlPool = pool;

export const db = drizzle(pool);
