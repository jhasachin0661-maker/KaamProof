import { db } from "@/db";
import { auditLogs } from "@/db/schema";
import type { Principal } from "./auth";

export interface AuditParams {
  actor?: Principal | null;
  actorId?: string | null;
  actorRole?: string | null;
  action: string;
  entityType: string;
  entityId: string;
  details?: string;
  scopeWorkerId?: string | null;
  scopeEmployerId?: string | null;
  before?: unknown;
  after?: unknown;
  request?: Request;
}

/** Append-only audit trail. There is intentionally NO update/delete API for audit_logs. */
export async function logAuditEvent(p: AuditParams) {
  try {
    const ip = p.request?.headers.get("x-forwarded-for")?.split(",")[0].trim().slice(0, 64) || null;
    const ua = p.request?.headers.get("user-agent")?.slice(0, 200) || null;
    await db.insert(auditLogs).values({
      actorId: p.actor?.userId ?? p.actorId ?? null,
      actorRole: p.actor?.role ?? p.actorRole ?? null,
      action: p.action,
      entityType: p.entityType,
      entityId: p.entityId,
      details: p.details?.slice(0, 1000) ?? null,
      ipAddress: ip,
      deviceMetadata: ua,
      scopeWorkerId: p.scopeWorkerId ?? null,
      scopeEmployerId: p.scopeEmployerId ?? null,
      beforeData: (p.before as object) ?? null,
      afterData: (p.after as object) ?? null,
    });
  } catch (err) {
    console.error("Failed to record audit log:", err);
  }
}
