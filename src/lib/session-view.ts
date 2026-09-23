import type { workSessions } from "@/db/schema";

type Session = typeof workSessions.$inferSelect;

/** Employers never receive raw GPS coordinates — only accuracy and whether location evidence exists. */
export function forEmployer(s: Session) {
  const { startLatitude, startLongitude, endLatitude, endLongitude, idempotencyKey, ...rest } = s;
  void idempotencyKey;
  return { ...rest, hasStartLocation: startLatitude !== null && startLongitude !== null, hasEndLocation: endLatitude !== null && endLongitude !== null };
}
export function forWorker(s: Session) {
  const { idempotencyKey, ...rest } = s;
  void idempotencyKey;
  return rest;
}
