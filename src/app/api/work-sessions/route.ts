import { NextResponse } from "next/server";
import { and, desc, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { workSessions, disputes, anomalyScores, attendanceEvents, users, wageAgreements } from "@/db/schema";
import { getPrincipal, requireEmployer, requireWorker } from "@/lib/auth";
import { getActiveAgreement, getOwnedRelationship } from "@/lib/access";
import { Errors, errorResponse, isUniqueViolation } from "@/lib/errors";
import { logAuditEvent } from "@/lib/audit";
import { evaluateSessionAnomaly } from "@/lib/anomaly";
import { calculateWage } from "@/lib/wage";
import { forEmployer, forWorker } from "@/lib/session-view";
import { dateTime, num, oneOf, readJson, str, uuid, type Body } from "@/lib/validate";

export const dynamic = "force-dynamic";
const STATUSES = ["open", "pending_confirmation", "confirmed", "disputed", "cancelled"] as const;
const KEY_RE = /^[A-Za-z0-9_.:-]{8,100}$/;

function idemKey(b: Body, workerId: string): string | null {
  const raw = b.idempotencyKey;
  if (raw === undefined || raw === null || raw === "") return null;
  if (typeof raw !== "string" || !KEY_RE.test(raw)) throw Errors.invalid("Invalid idempotency key.", "अमान्य idempotency key।");
  return `${workerId}:${raw}`; // namespaced per worker so keys can never collide across users
}
function geo(b: Body) {
  const lat = num(b, "latitude", { min: -90, max: 90 });
  const lon = num(b, "longitude", { min: -180, max: 180 });
  const acc = num(b, "accuracyMeters", { min: 0, max: 1_000_000 });
  return {
    lat: lat !== undefined && lon !== undefined ? lat.toFixed(7) : null,
    lon: lat !== undefined && lon !== undefined ? lon.toFixed(7) : null,
    acc: acc !== undefined ? acc.toFixed(2) : null,
  };
}

/* ---------------- GET ---------------- */
export async function GET(request: Request) {
  try {
    const p = await getPrincipal(request);
    const status = new URL(request.url).searchParams.get("status");
    const conds = [p.role === "worker" ? eq(workSessions.workerId, p.userId) : eq(workSessions.employerId, p.userId)];
    if (status) conds.push(eq(workSessions.status, oneOf({ status }, "status", STATUSES)));

    const rows = await db.select().from(workSessions).where(and(...conds)).orderBy(desc(workSessions.createdAt)).limit(300);
    const ids = [...new Set(rows.flatMap((s) => [s.workerId, s.employerId]))];
    const names = ids.length ? await db.select({ id: users.id, name: users.name }).from(users).where(inArray(users.id, ids)) : [];
    const nm = new Map(names.map((u) => [u.id, u.name]));
    const sessions = rows.map((s) => ({
      ...(p.role === "worker" ? forWorker(s) : forEmployer(s)),
      workerName: nm.get(s.workerId) || "Worker",
      employerName: nm.get(s.employerId) || "Employer",
    }));
    return NextResponse.json({ sessions });
  } catch (e) {
    return errorResponse(e, "sessions-get");
  }
}

/* ---------------- POST ---------------- */
export async function POST(request: Request) {
  try {
    const b = await readJson(request);
    const action = oneOf(b, "action", ["start", "end", "cancel", "confirm", "dispute"] as const, "start");
    const now = new Date();

    /* ===== START (worker) ===== */
    if (action === "start") {
      const p = await requireWorker(request);
      const rel = await getOwnedRelationship(p, uuid(b, "relationshipId")!, { requireActive: true });
      const agreement = await getActiveAgreement(rel.id);
      if (!agreement) throw Errors.conflict("NO_ACTIVE_AGREEMENT", "No accepted wage agreement exists yet.", "अभी कोई स्वीकृत वेतन समझौता नहीं है।");

      const key = idemKey(b, p.userId);
      if (key) {
        const [dup] = await db.select().from(workSessions).where(eq(workSessions.idempotencyKey, key)).limit(1);
        if (dup) return NextResponse.json({ success: true, session: forWorker(dup), duplicateIgnored: true });
      }
      const g = geo(b);
      const offline = b.wasOfflineSynced === true;
      const deviceTs = dateTime(b, "deviceTimestamp");
      try {
        const session = await db.transaction(async (tx) => {
          const [s] = await tx.insert(workSessions).values({
            workerId: p.userId, employerId: rel.employerId, relationshipId: rel.id, agreementId: agreement.id,
            idempotencyKey: key, status: "open", serverStartReceivedAt: now, deviceStartTime: deviceTs ?? now,
            startLatitude: g.lat, startLongitude: g.lon, startAccuracyMeters: g.acc,
            startLocationNote: str(b, "locationNote", { max: 200, required: false }) ?? null,
            wasOfflineSynced: offline, syncStatus: offline ? "needs_review" : "synced",
          }).returning();
          await tx.insert(attendanceEvents).values({
            sessionId: s.id, workerId: p.userId, eventType: "start", idempotencyKey: key ? `${key}_start` : null,
            deviceTimestamp: deviceTs ?? now, serverReceivedAt: now, latitude: g.lat, longitude: g.lon, accuracyMeters: g.acc, capturedOffline: offline,
          });
          return s;
        });
        await logAuditEvent({ actor: p, action: "WORK_SESSION_STARTED", entityType: "work_session", entityId: session.id, details: `Shift started (GPS acc=${g.acc ?? "N/A"}m${offline ? ", captured offline" : ""})`, scopeWorkerId: p.userId, scopeEmployerId: rel.employerId, request });
        return NextResponse.json({ success: true, session: forWorker(session) }, { status: 201 });
      } catch (e) {
        if (isUniqueViolation(e, "uniq_open_session_per_worker")) {
          const [active] = await db.select().from(workSessions).where(and(eq(workSessions.workerId, p.userId), eq(workSessions.status, "open"))).limit(1);
          throw Errors.conflict("ACTIVE_SESSION_EXISTS", "An active work session already exists for your account.", "पहले से एक कार्य सत्र प्रगति पर है। पहले उसे समाप्त करें।", { activeSession: active ? forWorker(active) : null });
        }
        if (key && isUniqueViolation(e)) {
          const [dup] = await db.select().from(workSessions).where(eq(workSessions.idempotencyKey, key)).limit(1);
          if (dup) return NextResponse.json({ success: true, session: forWorker(dup), duplicateIgnored: true });
        }
        throw e;
      }
    }

    /* ===== END / CANCEL (worker, own session) ===== */
    if (action === "end" || action === "cancel") {
      const p = await requireWorker(request);
      // A session started while offline has no server id yet: the queued "end" refers to it by the START's idempotency key.
      const sessionId = uuid(b, "sessionId", false);
      const startKey = idemKey({ idempotencyKey: b.startIdempotencyKey }, p.userId);
      if (!sessionId && !startKey) throw Errors.invalid("sessionId or startIdempotencyKey is required.");
      const [session] = await db.select().from(workSessions).where(and(sessionId ? eq(workSessions.id, sessionId) : eq(workSessions.idempotencyKey, startKey!), eq(workSessions.workerId, p.userId))).limit(1);
      if (!session) throw Errors.notFound("Work session not found.", "कार्य सत्र नहीं मिला।");

      if (action === "cancel") {
        if (session.status !== "open") throw Errors.conflict("SESSION_NOT_OPEN", "Only an open session can be cancelled.");
        const [c] = await db.update(workSessions).set({ status: "cancelled", updatedAt: now }).where(and(eq(workSessions.id, session.id), eq(workSessions.status, "open"))).returning();
        if (!c) throw Errors.conflict("SESSION_NOT_OPEN", "Only an open session can be cancelled.");
        await logAuditEvent({ actor: p, action: "WORK_SESSION_CANCELLED", entityType: "work_session", entityId: c.id, scopeWorkerId: p.userId, scopeEmployerId: c.employerId, before: session, after: c, request });
        return NextResponse.json({ success: true, session: forWorker(c) });
      }

      const key = idemKey(b, p.userId);
      if (session.status !== "open") {
        if (key) {
          const [ev] = await db.select().from(attendanceEvents).where(eq(attendanceEvents.idempotencyKey, `${key}_end`)).limit(1);
          if (ev && ev.sessionId === session.id) return NextResponse.json({ success: true, session: forWorker(session), duplicateIgnored: true });
        }
        throw Errors.conflict("SESSION_NOT_OPEN", "This session is already closed.", "यह सत्र पहले ही समाप्त हो चुका है।");
      }

      const g = geo(b);
      const deviceEnd = dateTime(b, "deviceTimestamp");
      const offline = b.wasOfflineSynced === true || session.wasOfflineSynced === true;

      // Duration is SERVER-authoritative. Client-supplied durations are never accepted.
      // Offline events could not be stamped by the server at the real moment, so device clock is used
      // ONLY for those and the session is flagged needs_review.
      let startMs = session.serverStartReceivedAt.getTime();
      let endMs = now.getTime();
      let usedDeviceClock = false;
      if (offline && session.deviceStartTime && deviceEnd) {
        const ds = session.deviceStartTime.getTime();
        const de = deviceEnd.getTime();
        if (de > ds && de - ds <= 24 * 3600 * 1000 && de <= now.getTime() + 5 * 60 * 1000) {
          startMs = ds; endMs = de; usedDeviceClock = true;
        }
      }
      const durationMinutes = Math.max(1, Math.round((endMs - startMs) / 60000));

      const agr = await getActiveAgreementFor(session.agreementId, session.relationshipId);
      if (!agr) throw Errors.conflict("NO_ACTIVE_AGREEMENT", "No wage agreement found for this session.");
      const wage = calculateWage(agr, durationMinutes);

      const updated = await db.transaction(async (tx) => {
        const [u] = await tx.update(workSessions).set({
          status: "pending_confirmation", serverEndReceivedAt: now, deviceEndTime: deviceEnd ?? now, durationMinutes,
          endLatitude: g.lat, endLongitude: g.lon, endAccuracyMeters: g.acc,
          endLocationNote: str(b, "locationNote", { max: 200, required: false }) ?? null,
          calculatedWage: wage.total.toFixed(2), regularMinutes: wage.regularMinutes, overtimeMinutes: wage.overtimeMinutes,
          baseEarnings: wage.baseEarnings.toFixed(2), overtimeEarnings: wage.overtimeEarnings.toFixed(2),
          wasOfflineSynced: offline, syncStatus: offline ? "needs_review" : "synced", updatedAt: now,
        }).where(and(eq(workSessions.id, session.id), eq(workSessions.status, "open"))).returning();
        if (!u) return null;
        await tx.insert(attendanceEvents).values({
          sessionId: u.id, workerId: p.userId, eventType: "end", idempotencyKey: key ? `${key}_end` : null,
          deviceTimestamp: deviceEnd ?? now, serverReceivedAt: now, latitude: g.lat, longitude: g.lon, accuracyMeters: g.acc, capturedOffline: offline,
        });
        return u;
      });
      if (!updated) throw Errors.conflict("SESSION_NOT_OPEN", "This session is already closed.");

      const anomaly = evaluateSessionAnomaly({
        deviceStartTime: session.deviceStartTime, serverStartTime: session.serverStartReceivedAt, deviceEndTime: updated.deviceEndTime,
        serverEndTime: now, durationMinutes,
        startAccuracyMeters: session.startAccuracyMeters ? parseFloat(session.startAccuracyMeters) : null,
        startLatitude: session.startLatitude ? parseFloat(session.startLatitude) : null,
      });
      if (offline) {
        anomaly.signalFlags.push(usedDeviceClock ? "Captured offline — duration uses device clock, needs review" : "Captured offline — needs review");
        anomaly.riskScore = Math.max(anomaly.riskScore, 0.35);
        if (anomaly.reviewPriority === "Low") anomaly.reviewPriority = "Medium";
      }
      if (anomaly.signalFlags.length > 0 || anomaly.riskScore > 0.3) {
        await db.insert(anomalyScores).values({
          sessionId: updated.id, workerId: p.userId, employerId: session.employerId, riskScore: anomaly.riskScore.toFixed(2),
          reviewPriority: anomaly.reviewPriority, signalFlags: anomaly.signalFlags, featuresExtracted: anomaly.features, humanReviewStatus: "pending_review",
        });
      }
      await logAuditEvent({ actor: p, action: "WORK_SESSION_ENDED", entityType: "work_session", entityId: updated.id, details: `Ended after ${durationMinutes} min; calculated ₹${wage.total.toFixed(2)}${offline ? " (offline, needs review)" : ""}`, scopeWorkerId: p.userId, scopeEmployerId: session.employerId, after: { durationMinutes, wage }, request });
      return NextResponse.json({ success: true, session: forWorker(updated) });
    }

    /* ===== CONFIRM / DISPUTE (employer, own session, must be pending) ===== */
    const p = await requireEmployer(request);
    const sessionId = uuid(b, "sessionId")!;
    const remarks = str(b, "employerRemarks", { max: 500, required: false });
    const [session] = await db.select().from(workSessions).where(and(eq(workSessions.id, sessionId), eq(workSessions.employerId, p.userId))).limit(1);
    if (!session) throw Errors.notFound("Work session not found.", "कार्य सत्र नहीं मिला।");
    if (session.status !== "pending_confirmation") throw Errors.conflict("SESSION_NOT_PENDING", "Only sessions waiting for confirmation can be confirmed or disputed.", "केवल पुष्टि की प्रतीक्षा वाले सत्र की पुष्टि या विवाद हो सकता है।");

    if (action === "confirm") {
      const [u] = await db.update(workSessions).set({ status: "confirmed", confirmedAt: now, employerRemarks: remarks ?? null, updatedAt: now })
        .where(and(eq(workSessions.id, session.id), eq(workSessions.status, "pending_confirmation"))).returning();
      if (!u) throw Errors.conflict("SESSION_NOT_PENDING", "Session was already reviewed.");
      await logAuditEvent({ actor: p, action: "WORK_SESSION_CONFIRMED", entityType: "work_session", entityId: u.id, details: remarks ?? "Employer confirmed the session", scopeWorkerId: u.workerId, scopeEmployerId: p.userId, before: { status: session.status }, after: { status: u.status }, request });
      return NextResponse.json({ success: true, session: forEmployer(u) });
    }

    const description = remarks ?? "Employer reported a discrepancy in this session.";
    const u = await db.transaction(async (tx) => {
      const [s] = await tx.update(workSessions).set({ status: "disputed", employerRemarks: description, updatedAt: now })
        .where(and(eq(workSessions.id, session.id), eq(workSessions.status, "pending_confirmation"))).returning();
      if (!s) return null;
      await tx.insert(disputes).values({ raisedByUserId: p.userId, workerId: s.workerId, employerId: s.employerId, sessionId: s.id, reasonCategory: "wrong_duration", description, status: "open" });
      return s;
    });
    if (!u) throw Errors.conflict("SESSION_NOT_PENDING", "Session was already reviewed.");
    await logAuditEvent({ actor: p, action: "WORK_SESSION_DISPUTED", entityType: "work_session", entityId: u.id, details: description, scopeWorkerId: u.workerId, scopeEmployerId: p.userId, before: { status: session.status }, after: { status: u.status }, request });
    return NextResponse.json({ success: true, session: forEmployer(u) });
  } catch (e) {
    return errorResponse(e, "sessions-post");
  }
}

async function getActiveAgreementFor(agreementId: string | null, relationshipId: string) {
  if (agreementId) {
    const [a] = await db.select().from(wageAgreements).where(eq(wageAgreements.id, agreementId)).limit(1);
    if (a) return a; // the agreement in force when the session started (even if superseded since)
  }
  return getActiveAgreement(relationshipId);
}
