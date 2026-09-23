/**
 * DEVELOPMENT / DEMO ONLY. Never runs in production.
 *   ALLOW_DEMO_SEED=true npm run db:seed:demo
 * Creates two clearly labelled demo accounts with an ACTIVE relationship and wage agreement.
 * Password is printed to the console; nothing is hardcoded into authentication.
 */
import "dotenv/config";
import crypto from "crypto";
import bcrypt from "bcryptjs";

async function main() {
  if (process.env.NODE_ENV === "production" || process.env.ALLOW_DEMO_SEED !== "true") {
    throw new Error("Refusing to seed: set ALLOW_DEMO_SEED=true and do not run in production.");
  }
  const { db } = await import("../src/db");
  const { users, workerProfiles, employerProfiles, employmentRelationships, wageAgreements } = await import("../src/db/schema");
  const { eq } = await import("drizzle-orm");

  const password = `Demo-${crypto.randomBytes(6).toString("hex")}1`;
  const passwordHash = await bcrypt.hash(password, 10);
  const existing = await db.select().from(users).where(eq(users.email, "demo.worker@example.com")).limit(1);
  if (existing.length) throw new Error("Demo data already exists.");

  const [w] = await db.insert(users).values({ email: "demo.worker@example.com", passwordHash, name: "[DEMO] Sunita Devi", role: "worker" }).returning();
  const [e] = await db.insert(users).values({ email: "demo.employer@example.com", passwordHash, name: "[DEMO] Sharma Household", role: "employer" }).returning();
  await db.insert(workerProfiles).values({ userId: w.id, occupation: "Domestic Worker", primaryLocation: "Delhi", preferredLang: "hi" });
  await db.insert(employerProfiles).values({ userId: e.id, companyOrHouseholdName: "[DEMO] Sharma Household", category: "Household", addressCity: "Delhi", contactPerson: "Demo Employer" });
  const now = new Date();
  const [rel] = await db.insert(employmentRelationships).values({ workerId: w.id, employerId: e.id, roleTitle: "Cook", status: "active", initiatedByRole: "worker", acceptedAt: now }).returning();
  await db.insert(wageAgreements).values({ relationshipId: rel.id, workerId: w.id, employerId: e.id, version: 1, jobType: "Cook", wageType: "daily", wageAmount: "500.00", status: "active", startDate: now.toISOString().split("T")[0], workerAcceptedAt: now, employerAcceptedAt: now });
  console.log(`Demo accounts created (email: demo.worker@example.com / demo.employer@example.com)\nPassword: ${password}`);
  process.exit(0);
}
main().catch((err) => { console.error(err.message); process.exit(1); });
