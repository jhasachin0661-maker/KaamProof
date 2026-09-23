import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { employmentRelationships, wageAgreements } from "@/db/schema";
import type { Principal } from "./auth";
import { Errors } from "./errors";

export type Relationship = typeof employmentRelationships.$inferSelect;
export type Agreement = typeof wageAgreements.$inferSelect;

/** Loads a relationship ONLY if the principal is one of its two parties. Otherwise 404 (no existence leak). */
export async function getOwnedRelationship(p: Principal, relationshipId: string, opts: { requireActive?: boolean } = {}): Promise<Relationship> {
  const [rel] = await db.select().from(employmentRelationships).where(eq(employmentRelationships.id, relationshipId)).limit(1);
  if (!rel || (rel.workerId !== p.userId && rel.employerId !== p.userId) || (p.role === "worker" ? rel.workerId : rel.employerId) !== p.userId) {
    throw Errors.notFound("Employment relationship not found.", "रोज़गार संबंध नहीं मिला।");
  }
  if (opts.requireActive && rel.status !== "active") {
    throw Errors.conflict("RELATIONSHIP_NOT_ACTIVE", "This employment relationship is not active.", "यह रोज़गार संबंध सक्रिय नहीं है।");
  }
  return rel;
}

export async function getActiveAgreement(relationshipId: string): Promise<Agreement | null> {
  const [a] = await db
    .select()
    .from(wageAgreements)
    .where(and(eq(wageAgreements.relationshipId, relationshipId), eq(wageAgreements.status, "active")))
    .limit(1);
  return a ?? null;
}

export const counterpartId = (p: Principal, rel: Relationship) => (p.role === "worker" ? rel.employerId : rel.workerId);
