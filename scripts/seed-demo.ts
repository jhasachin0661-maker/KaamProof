/**
 * DEVELOPMENT / DEMO ONLY. Never runs in production.
 *   ALLOW_DEMO_SEED=true npm run db:seed:demo
 * Creates two clearly labelled demo accounts with an ACTIVE relationship and wage agreement.
 * DEMO_PASSWORD is required from the environment and is never used by normal users.
 */
import "dotenv/config";

async function main() {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Refusing to seed: demo seeding is disabled in production.");
  }
  if (process.env.APP_ENV !== "development") {
    throw new Error("Refusing to seed: APP_ENV must be development.");
  }
  if (process.env.ALLOW_DEMO_SEED !== "true") {
    throw new Error("Refusing to seed: ALLOW_DEMO_SEED=true is required.");
  }
  if (process.env.DATABASE_TARGET !== "development") {
    throw new Error("Refusing to seed: DATABASE_TARGET must be development.");
  }
  if (!process.env.DEMO_PASSWORD) {
    throw new Error("Refusing to seed: DEMO_PASSWORD is required and must not be hard-coded.");
  }
  const { db } = await import("../src/db");
  const { users, workerProfiles, employerProfiles, employmentRelationships, wageAgreements } = await import("../src/db/schema");
  const { hashPassword } = await import("../src/lib/auth");
  const { and, eq } = await import("drizzle-orm");

  // Deterministic demo identities make this script idempotent.
  // Override only for an isolated development database with unused numbers.
  const workerPhone = process.env.DEMO_WORKER_PHONE || "9000000001";
  const employerPhone = process.env.DEMO_EMPLOYER_PHONE || "9111111111";
  const result = await db.transaction(async (tx) => {
    const [existingWorker] = await tx.select().from(users).where(eq(users.phone, workerPhone)).limit(1);
    const [existingEmployer] = await tx.select().from(users).where(eq(users.phone, employerPhone)).limit(1);
    const existing = [existingWorker, existingEmployer].filter(Boolean);
    if (existing.some((user) => !user.name.startsWith("[DEMO]"))) {
      throw new Error("Refusing to seed: a deterministic demo phone number belongs to a real user.");
    }

    const passwordHash = await hashPassword(process.env.DEMO_PASSWORD!);
    const [w] = existingWorker
      ? [existingWorker]
      : await tx.insert(users).values({ phone: workerPhone, name: "[DEMO] Sunita Devi", role: "worker", passwordHash }).returning();
    const [e] = existingEmployer
      ? [existingEmployer]
      : await tx.insert(users).values({ phone: employerPhone, name: "[DEMO] Sharma Household", role: "employer", passwordHash }).returning();

    if (!existingWorker) await tx.insert(workerProfiles).values({ userId: w.id, occupation: "Domestic Worker", primaryLocation: "Delhi", preferredLang: "hi" });
    if (!existingEmployer) await tx.insert(employerProfiles).values({ userId: e.id, companyOrHouseholdName: "[DEMO] Sharma Household", category: "Household", addressCity: "Delhi", contactPerson: "Demo Employer" });

    const [existingRelationship] = await tx.select().from(employmentRelationships).where(and(eq(employmentRelationships.workerId, w.id), eq(employmentRelationships.employerId, e.id), eq(employmentRelationships.status, "active"))).limit(1);
    if (!existingRelationship) {
      const now = new Date();
      const [rel] = await tx.insert(employmentRelationships).values({ workerId: w.id, employerId: e.id, roleTitle: "Cook", status: "active", initiatedByRole: "worker", acceptedAt: now }).returning();
      await tx.insert(wageAgreements).values({ relationshipId: rel.id, workerId: w.id, employerId: e.id, version: 1, jobType: "Cook", wageType: "daily", wageAmount: "500.00", status: "active", startDate: now.toISOString().split("T")[0], workerAcceptedAt: now, employerAcceptedAt: now });
      return { createdUsers: (existingWorker ? 0 : 1) + (existingEmployer ? 0 : 1), reusedUsers: existing.length, createdRecords: 3, reusedRecords: 0 };
    }
    return { createdUsers: 0, reusedUsers: 2, createdRecords: 0, reusedRecords: 3 };
  });
  console.log(JSON.stringify({ ...result, duplicatesCreated: 0 }));
}
main().catch((err) => { console.error(err.message); process.exit(1); });
