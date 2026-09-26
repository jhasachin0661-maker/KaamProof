// End-to-end API tests. Requires a running server (npm run start) and a migrated database.
//   BASE_URL=http://127.0.0.1:3000 DATABASE_URL=postgresql://... node tests/api.e2e.mjs
import pg from "pg";
import crypto from "crypto";

const BASE = process.env.BASE_URL || "http://127.0.0.1:3000";
const db = new pg.Client({ connectionString: process.env.DATABASE_URL });
await db.connect();

let passed = 0, failed = 0;
const failures = [];
function check(name, cond, extra) {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; failures.push(name); console.log(`  ✗ ${name}${extra !== undefined ? "  -> " + JSON.stringify(extra).slice(0, 300) : ""}`); }
}
const group = (t) => console.log(`\n${t}`);

class Client {
  constructor(label) { this.label = label; this.cookie = ""; }
  async req(method, path, body, headers = {}) {
    const res = await fetch(BASE + path, {
      method, redirect: "manual",
      headers: { ...(body ? { "Content-Type": "application/json" } : {}), ...(this.cookie ? { Cookie: this.cookie } : {}), ...headers },
      body: body ? JSON.stringify(body) : undefined,
    });
    const setCookie = res.headers.get("set-cookie");
    if (setCookie) { const kv = setCookie.split(";")[0]; this.cookie = kv.endsWith("=") ? "" : kv; this.lastSetCookie = setCookie; }
    let json = null; const text = await res.text();
    try { json = JSON.parse(text); } catch { json = { _text: text }; }
    return { status: res.status, json, headers: res.headers };
  }
  get(p) { return this.req("GET", p); }
  post(p, b) { return this.req("POST", p, b); }
}

const run = Date.now().toString(36);
const PW = "Sturdy-pass-12345";
const mk = async (label, role, extra = {}) => {
  const c = new Client(label);
  c.email = `${label}.${run}@example.com`;
  const r = await c.post("/api/auth/register", { role, name: `${label} User`, email: c.email, password: PW, occupationOrCompany: "Cook", locationCity: "Delhi", ...extra });
  c.reg = r; c.id = r.json?.user?.id;
  return c;
};
const sidOf = (r) => r.json.session?.id;

/* ================= AUTH ================= */
group("AUTH");
const wA = await mk("workerA", "worker");
const wB = await mk("workerB", "worker");
const eA = await mk("employerA", "employer");
const eB = await mk("employerB", "employer");
check("register worker → 201", wA.reg.status === 201, wA.reg.json);
check("register employer → 201", eA.reg.status === 201);
check("session cookie is HttpOnly + SameSite=Lax", /HttpOnly/i.test(wA.lastSetCookie) && /SameSite=lax/i.test(wA.lastSetCookie), wA.lastSetCookie);
check("no token / password hash in register body", !/token|passwordHash|password_hash/i.test(JSON.stringify(wA.reg.json)));
for (const role of ["admin", "ngo_coordinator", "superadmin", "administrator"]) {
  const r = await new Client("x").post("/api/auth/register", { role, name: "Evil", email: `evil.${role}.${run}@example.com`, password: PW });
  check(`register role=${role} rejected`, r.status === 400 && r.json.error_code === "ROLE_NOT_ALLOWED", r.json);
}
check("weak password rejected", (await new Client("x").post("/api/auth/register", { role: "worker", name: "Weak", email: `weak.${run}@example.com`, password: "short1" })).status === 400);
check("duplicate email → 409", (await new Client("x").post("/api/auth/register", { role: "worker", name: "Dup", email: wA.email, password: PW })).status === 409);

const bad1 = await new Client("x").post("/api/auth/login", { email: wA.email, password: "Wrong-password-1" });
const bad2 = await new Client("x").post("/api/auth/login", { email: `nobody.${run}@example.com`, password: "Wrong-password-1" });
check("invalid credentials → generic 401", bad1.status === 401 && bad1.json.error_code === "INVALID_CREDENTIALS" && bad1.json.message_en === bad2.json.message_en);
check("unauthenticated /me → 401 AUTH_REQUIRED", (await new Client("x").get("/api/auth/me")).json.error_code === "AUTH_REQUIRED");
const bogus = new Client("bogus"); bogus.cookie = "kp_session=notarealtoken";
check("forged session cookie rejected", (await bogus.get("/api/auth/me")).status === 401);

const wA2 = new Client("wA-login");
const li = await wA2.post("/api/auth/login", { email: wA.email, password: PW });
check("login works", li.status === 200 && li.json.user.role === "worker");
check("/me returns identity from cookie", (await wA2.get("/api/auth/me")).json.user.id === wA.id);
await wA2.post("/api/auth/logout", {});
check("logout revokes session", (await wA2.get("/api/auth/me")).status === 401);
const oldCookie = new Client("replay"); oldCookie.cookie = wA.cookie;
// session expiry
const exp = new Client("exp");
await exp.post("/api/auth/login", { email: wB.email, password: PW });
check("session valid before expiry", (await exp.get("/api/auth/me")).status === 200);
await db.query("update auth_sessions set expires_at = now() - interval '1 minute' where user_id = $1", [wB.id]);
check("expired session rejected", (await exp.get("/api/auth/me")).json.error_code === "SESSION_INVALID");
check("token stored hashed (no raw cookie in DB)", (await db.query("select count(*)::int c from auth_sessions where token_hash = $1", [wA.cookie.split("=")[1]])).rows[0].c === 0);
await wB.post("/api/auth/login", { email: wB.email, password: PW }); // fresh session for later

group("CSRF");
const csrf = await wA.req("POST", "/api/consents", { consentType: "location_capture", isAccepted: true }, { Origin: "https://evil.example" });
check("cross-origin mutation blocked", csrf.status === 403 && csrf.json.error_code === "CSRF_BLOCKED", csrf.json);

group("RBAC / ROLE ESCALATION");
check("worker cannot read employer review queue", (await wA.get("/api/review")).status === 403);
check("worker cannot read audit via review", (await wA.get("/api/review?type=audit")).status === 403);
check("worker cannot review anomaly", (await wA.post("/api/review", { anomalyId: "00000000-0000-4000-8000-000000000000", decision: "dismissed" })).status === 403);
check("employer cannot generate certificate", (await eA.post("/api/certificates", { relationshipId: "00000000-0000-4000-8000-000000000000" })).status === 403);
check("employer cannot start work session", (await eA.post("/api/work-sessions", { action: "start", relationshipId: "00000000-0000-4000-8000-000000000000" })).status === 403);
await wA.req("PATCH", "/api/auth/me", { role: "employer", isAdmin: true, admin: true, name: "Sunita" });
check("role cannot be changed via profile PATCH", (await wA.get("/api/auth/me")).json.user.role === "worker");
let roleBlocked = false;
try { await db.query("insert into users(email,password_hash,name,role) values('a@b.c','x','n','admin')"); } catch { roleBlocked = true; }
check("DB CHECK constraint rejects role=admin", roleBlocked);
check("client-supplied userId ignored on /api/metrics", (await wA.get(`/api/metrics?userId=${wB.id}`)).json.activeSession === null);

/* ================= EMPLOYMENT ================= */
group("EMPLOYMENT");
check("lookup of unknown employer → 404", (await wA.post("/api/employment", { action: "create", counterpartyIdentifier: `ghost.${run}@example.com`, wageAmount: 500 })).status === 404);
check("worker cannot connect to a worker account", (await wA.post("/api/employment", { action: "create", counterpartyIdentifier: wB.email, wageAmount: 500 })).status === 404);
const reqRes = await wA.post("/api/employment", { action: "create", counterpartyIdentifier: eA.email, roleTitle: "Cook", wageAmount: 500, wageType: "daily", jobType: "Cook" });
check("worker sends request → pending", reqRes.status === 201 && reqRes.json.relationship.status === "pending", reqRes.json);
const relId = reqRes.json.relationship.id;
check("duplicate live request → 409", (await wA.post("/api/employment", { action: "create", counterpartyIdentifier: eA.email, wageAmount: 500 })).status === 409);
check("requester cannot self-accept", (await wA.post("/api/employment", { action: "respond", relationshipId: relId, decision: "accept" })).status === 403);
check("employer B cannot see the request", (await eB.get("/api/employment")).json.relationships.length === 0);
check("employer B cannot respond to it (404)", (await eB.post("/api/employment", { action: "respond", relationshipId: relId, decision: "accept" })).status === 404);
check("cannot start work while pending", (await wA.post("/api/work-sessions", { action: "start", relationshipId: relId })).json.error_code === "RELATIONSHIP_NOT_ACTIVE");
const accept = await eA.post("/api/employment", { action: "respond", relationshipId: relId, decision: "accept" });
check("employer accepts → active", accept.json.relationship?.status === "active", accept.json);
let rels = (await wA.get("/api/employment")).json.relationships;
check("both sides see the active relationship + v1 agreement", rels[0].status === "active" && rels[0].agreement.status === "active" && rels[0].agreement.version === 1 && (await eA.get("/api/employment")).json.relationships.length === 1);
check("worker B sees no relationships", (await wB.get("/api/employment")).json.relationships.length === 0);

group("WAGE AGREEMENT VERSIONING");
const up = await eA.post("/api/employment", { action: "upgrade_agreement", relationshipId: relId, wageAmount: 550, wageType: "daily" });
check("employer proposes v2 → pending_acceptance", up.status === 201 && up.json.agreement.version === 2 && up.json.agreement.status === "pending_acceptance", up.json);
check("v1 still active until accepted", (await wA.get("/api/employment")).json.relationships[0].agreementHistory.find((a) => a.version === 1).status === "active");
check("proposer cannot accept own proposal", (await eA.post("/api/employment", { action: "accept_agreement", agreementId: up.json.agreement.id })).status === 403);
check("employer B cannot accept (404)", (await eB.post("/api/employment", { action: "accept_agreement", agreementId: up.json.agreement.id })).status === 404);
check("worker B cannot propose on someone else's relationship", (await wB.post("/api/employment", { action: "upgrade_agreement", relationshipId: relId, wageAmount: 1 })).status === 404);
const acc2 = await wA.post("/api/employment", { action: "accept_agreement", agreementId: up.json.agreement.id });
check("worker accepts v2 → active", acc2.json.agreement?.status === "active", acc2.json);
const hist = (await wA.get("/api/employment")).json.relationships[0].agreementHistory;
check("v1 superseded and preserved", hist.find((a) => a.version === 1).status === "superseded" && hist.length === 2);
check("unsupported wage type rejected", (await eA.post("/api/employment", { action: "upgrade_agreement", relationshipId: relId, wageAmount: 9000, wageType: "monthly" })).status === 400);

/* ================= WORK SESSIONS ================= */
group("WORK SESSIONS");
check("worker B cannot start on A's relationship", (await wB.post("/api/work-sessions", { action: "start", relationshipId: relId })).status === 404);
const K1 = `start-${run}-0001`;
const s1 = await wA.post("/api/work-sessions", { action: "start", relationshipId: relId, latitude: 28.6139, longitude: 77.209, accuracyMeters: 20, deviceTimestamp: new Date().toISOString(), idempotencyKey: K1 });
check("start session → 201 open", s1.status === 201 && s1.json.session.status === "open", s1.json);
const sess1 = s1.json.session.id;
const s1dup = await wA.post("/api/work-sessions", { action: "start", relationshipId: relId, idempotencyKey: K1 });
check("idempotent retry returns ORIGINAL session", s1dup.json.duplicateIgnored === true && s1dup.json.session.id === sess1);
const s1b = await wA.post("/api/work-sessions", { action: "start", relationshipId: relId, idempotencyKey: `start-${run}-0002` });
check("second open session blocked (409 ACTIVE_SESSION_EXISTS)", s1b.status === 409 && s1b.json.error_code === "ACTIVE_SESSION_EXISTS");
const race = await Promise.all([1, 2, 3].map((i) => wB.post("/api/work-sessions", { action: "start", relationshipId: relId, idempotencyKey: `race-${run}-${i}` })));
check("worker B (no relationship) cannot create sessions in a race", race.every((r) => r.status === 404));
check("open session count for worker A == 1", (await db.query("select count(*)::int c from work_sessions where worker_id=$1 and status='open'", [wA.id])).rows[0].c === 1);
check("worker cannot end another worker's session", (await wB.post("/api/work-sessions", { action: "end", sessionId: sess1 })).status === 404);
check("employer cannot end a session", (await eA.post("/api/work-sessions", { action: "end", sessionId: sess1 })).status === 403);
const K2 = `end-${run}-0001`;
const e1 = await wA.post("/api/work-sessions", { action: "end", sessionId: sess1, durationMinutes: 480, simulatedWorkMinutes: 480, idempotencyKey: K2 });
check("end → pending_confirmation", e1.json.session?.status === "pending_confirmation", e1.json);
check("client-supplied duration is IGNORED (server clock)", e1.json.session.durationMinutes <= 2, e1.json.session.durationMinutes);
check("server calculated wage from ACTIVE agreement v2 (daily 550)", e1.json.session.calculatedWage === "550.00" && e1.json.session.baseEarnings === "550.00" && e1.json.session.overtimeEarnings === "0.00", e1.json.session);
check("duplicate end with same key → original", (await wA.post("/api/work-sessions", { action: "end", sessionId: sess1, idempotencyKey: K2 })).json.duplicateIgnored === true);
check("end again with new key → 409", (await wA.post("/api/work-sessions", { action: "end", sessionId: sess1, idempotencyKey: `end-${run}-0002` })).json.error_code === "SESSION_NOT_OPEN");
const sv = (await eA.get("/api/work-sessions")).json.sessions;
check("employer sees session but NOT raw GPS", sv.length === 1 && sv[0].startLatitude === undefined && sv[0].hasStartLocation === true);
check("worker sees own GPS", (await wA.get("/api/work-sessions")).json.sessions[0].startLatitude !== undefined);
check("worker B sees no sessions / query params ignored", (await wB.get(`/api/work-sessions?workerId=${wA.id}&viewMode=admin_all`)).json.sessions.length === 0);
check("employer B sees no sessions", (await eB.get("/api/work-sessions?viewMode=admin_all")).json.sessions.length === 0);
check("employer B cannot confirm A's session (404)", (await eB.post("/api/work-sessions", { action: "confirm", sessionId: sess1 })).status === 404);
check("worker cannot confirm own session (403)", (await wA.post("/api/work-sessions", { action: "confirm", sessionId: sess1 })).status === 403);
check("employer A confirms", (await eA.post("/api/work-sessions", { action: "confirm", sessionId: sess1, employerRemarks: "ok" })).json.session?.status === "confirmed");
check("confirm twice → 409", (await eA.post("/api/work-sessions", { action: "confirm", sessionId: sess1 })).status === 409);

// offline session (device clock, flagged)
const t0 = Date.now();
const off1 = await wA.post("/api/work-sessions", { action: "start", relationshipId: relId, wasOfflineSynced: true, deviceTimestamp: new Date(t0 - 2 * 3600e3).toISOString(), idempotencyKey: `off-${run}-start` });
check("offline start marked needs_review", off1.json.session?.wasOfflineSynced === true && off1.json.session.syncStatus === "needs_review", off1.json);
const off2 = await wA.post("/api/work-sessions", { action: "end", sessionId: off1.json.session.id, wasOfflineSynced: true, deviceTimestamp: new Date(t0 - 3600e3).toISOString(), idempotencyKey: `off-${run}-end` });
check("offline duration uses device clock (60 min) and needs_review", off2.json.session?.durationMinutes === 60 && off2.json.session.syncStatus === "needs_review", off2.json);
const sess2 = off1.json.session.id;
const capOff = await db.query("select captured_offline from attendance_events where session_id=$1", [sess2]);
check("attendance events flagged captured_offline", capOff.rows.length === 2 && capOff.rows.every((r) => r.captured_offline === true));

/* ================= PAYMENTS ================= */
group("PAYMENTS");
check("employer B cannot record payment on A's relationship", (await eB.post("/api/payments", { relationshipId: relId, amount: 100 })).status === 404);
check("invalid amount rejected", (await eA.post("/api/payments", { relationshipId: relId, amount: -5 })).status === 400);
const PK = `pay-${run}-0001`;
const p1 = await eA.post("/api/payments", { relationshipId: relId, amount: 300, paymentMethod: "Cash", idempotencyKey: PK, workerId: wB.id, employerId: eB.id });
check("employer records payment → pending_confirmation (not auto-confirmed)", p1.status === 201 && p1.json.payment.status === "pending_confirmation" && p1.json.payment.workerId === wA.id, p1.json);
check("idempotent payment retry → same record", (await eA.post("/api/payments", { relationshipId: relId, amount: 300, idempotencyKey: PK })).json.duplicateIgnored === true);
check("recorder cannot self-confirm", (await eA.post("/api/payments", { action: "confirm", paymentId: p1.json.payment.id })).status === 403);
check("unrelated employer/worker cannot confirm (404)", (await eB.post("/api/payments", { action: "confirm", paymentId: p1.json.payment.id })).status === 404 && (await wB.post("/api/payments", { action: "confirm", paymentId: p1.json.payment.id })).status === 404);
check("worker confirms → confirmed", (await wA.post("/api/payments", { action: "confirm", paymentId: p1.json.payment.id })).json.payment?.status === "confirmed");
check("duplicate confirmation → PAYMENT_ALREADY_CONFIRMED", (await wA.post("/api/payments", { action: "confirm", paymentId: p1.json.payment.id })).json.error_code === "PAYMENT_ALREADY_CONFIRMED");
const p2 = await wA.post("/api/payments", { relationshipId: relId, amount: 100 });
check("worker-recorded payment awaits EMPLOYER", p2.json.payment.status === "pending_confirmation" && (await wA.post("/api/payments", { action: "confirm", paymentId: p2.json.payment.id })).status === 403);
check("employer confirms worker-recorded payment", (await eA.post("/api/payments", { action: "confirm", paymentId: p2.json.payment.id })).json.payment?.status === "confirmed");
const p3 = await eA.post("/api/payments", { relationshipId: relId, amount: 50 });
check("worker disputes payment → disputed + dispute row", (await wA.post("/api/payments", { action: "dispute", paymentId: p3.json.payment.id, description: "Not received" })).json.payment?.status === "disputed");
check("payments isolated per user", (await eB.get("/api/payments")).json.payments.length === 0 && (await wB.get("/api/payments")).json.payments.length === 0);

/* ================= DISPUTES ================= */
group("DISPUTES");
check("worker B cannot raise dispute on A's session (404)", (await wB.post("/api/disputes", { sessionId: sess2, description: "x y z", reasonCategory: "other" })).status === 404);
const d1 = await wA.post("/api/disputes", { sessionId: sess2, reasonCategory: "wrong_duration", description: "I worked 8 hours, not 1" });
check("worker raises dispute (parties derived server-side)", d1.status === 201 && d1.json.dispute.employerId === eA.id, d1.json);
check("employer B sees none (even with viewMode=admin_all)", (await eB.get("/api/disputes?viewMode=admin_all")).json.disputes.length === 0);
check("worker cannot resolve (403)", (await wA.post("/api/disputes", { action: "resolve", disputeId: d1.json.dispute.id, resolutionNote: "self" })).status === 403);
check("employer B cannot resolve A's dispute (404)", (await eB.post("/api/disputes", { action: "resolve", disputeId: d1.json.dispute.id, resolutionNote: "hijack" })).status === 404);
const dres = await eA.post("/api/disputes", { action: "resolve", disputeId: d1.json.dispute.id, resolutionNote: "Agreed 1h" });
check("owning employer resolves + conflict notice returned", dres.json.dispute?.status === "resolved" && /party/i.test(dres.json.notice || ""), dres.json);
check("resolving closed dispute → DISPUTE_NOT_ALLOWED", (await eA.post("/api/disputes", { action: "resolve", disputeId: d1.json.dispute.id, resolutionNote: "again" })).json.error_code === "DISPUTE_NOT_ALLOWED");

/* ================= CERTIFICATES ================= */
group("CERTIFICATES / VERIFICATION");
check("worker B cannot generate for A's relationship (404)", (await wB.post("/api/certificates", { relationshipId: relId })).status === 404);
const c1 = await wA.post("/api/certificates", { relationshipId: relId, workerId: wB.id });
check("worker generates certificate", c1.status === 201 && /^KP-[A-Z2-9]{8}$/.test(c1.json.certificate?.certificateNumber || ""), c1.json);
const cert = c1.json.certificate;
check("verification URL is /verify/<code>", cert.verificationUrl === `/verify/${cert.certificateNumber}`);
check("certificate contains only confirmed work (1 confirmed day, Partially Confirmed/Disputed status)", cert.confirmedWorkdays === 1 && cert.disputedSessionsCount === 0, cert);
check("QR target page /verify/<code> renders", (await fetch(`${BASE}${cert.verificationUrl}`)).status === 200);
const anon = new Client("anon");
const v1 = await anon.get(`/api/verify/${cert.certificateNumber}`);
check("public verify → VERIFIED", v1.json.outcome === "VERIFIED" && v1.json.integrityValid === true, v1.json);
check("public verify leaks no PII", !new RegExp(`${wA.email}|${eA.email}|@example|phone|latitude|longitude`, "i").test(JSON.stringify(v1.json)));
check("unknown code → NOT_FOUND 404", (await anon.get("/api/verify/KP-ZZZZZZZZ")).json.outcome === "NOT_FOUND");
check("old guessable format not accepted", (await anon.get("/api/verify/KP-2026-DEL-1234")).status === 404);
await db.query("update certificates set confirmed_hours = '999.00' where id = $1", [cert.id]);
check("tampered record → INTEGRITY_CHECK_FAILED and contents hidden", (await anon.get(`/api/verify/${cert.certificateNumber}`)).json.outcome === "INTEGRITY_CHECK_FAILED");
await db.query("update certificates set confirmed_hours = $2 where id = $1", [cert.id, cert.confirmedHours]);
check("restored record verifies again", (await anon.get(`/api/verify/${cert.certificateNumber}`)).json.outcome === "VERIFIED");
check("employer cannot revoke (403)", (await eA.post("/api/certificates", { action: "revoke", certificateId: cert.id })).status === 403);
check("other worker cannot revoke (404)", (await wB.post("/api/certificates", { action: "revoke", certificateId: cert.id })).status === 404);
check("owner revokes", (await wA.post("/api/certificates", { action: "revoke", certificateId: cert.id, reason: "test" })).json.certificate?.isRevoked === true);
check("revoked → REVOKED", (await anon.get(`/api/verify/${cert.certificateNumber}`)).json.outcome === "REVOKED");
check("public verification attempts are logged", (await db.query("select count(*)::int c from verification_records where queried_id = $1", [cert.certificateNumber])).rows[0].c >= 4);
check("employer sees certificates issued for them; employer B none", (await eA.get("/api/certificates")).json.certificates.length === 1 && (await eB.get("/api/certificates")).json.certificates.length === 0);
const noWork = await wA.post("/api/certificates", { relationshipId: relId, periodStart: "2020-01-01", periodEnd: "2020-01-31" });
check("no confirmed work in period → NO_CONFIRMED_WORK", noWork.json.error_code === "NO_CONFIRMED_WORK");

/* ================= REVIEW / AUDIT / METRICS / EXPORT ================= */
group("REVIEW SIGNALS, AUDIT, METRICS");
const anA = (await eA.get("/api/review")).json.anomalies;
check("employer A sees review signals for own workers only", anA.length >= 1 && anA.every((a) => a.employerId === eA.id));
check("employer B sees none of A's signals", (await eB.get("/api/review")).json.anomalies.length === 0);
check("employer B cannot review A's signal (404)", (await eB.post("/api/review", { anomalyId: anA[0].id, decision: "dismissed" })).status === 404);
check("employer A reviews own signal", (await eA.post("/api/review", { anomalyId: anA[0].id, decision: "confirmed_normal", adminNotes: "checked" })).status === 200);
check("invalid review decision rejected", (await eA.post("/api/review", { anomalyId: anA[0].id, decision: "guilty" })).status === 400);
const auditA = (await eA.get("/api/review?type=audit")).json.logs;
const acts = new Set(auditA.map((l) => l.action));
const need = ["EMPLOYMENT_REQUESTED", "EMPLOYMENT_ACCEPTED", "WAGE_AGREEMENT_PROPOSED", "WAGE_AGREEMENT_ACCEPTED", "WORK_SESSION_STARTED", "WORK_SESSION_ENDED", "WORK_SESSION_CONFIRMED", "PAYMENT_RECORDED", "PAYMENT_CONFIRMED", "PAYMENT_DISPUTED", "DISPUTE_RAISED", "DISPUTE_RESOLVED", "CERTIFICATE_GENERATED", "CERTIFICATE_REVOKED", "ANOMALY_REVIEWED"];
check("audit trail has all key mutations", need.every((a) => acts.has(a)), need.filter((a) => !acts.has(a)));
const dbActs = new Set((await db.query("select distinct action from audit_logs")).rows.map((r) => r.action));
check("registration + login audited", dbActs.has("USER_REGISTERED") && dbActs.has("USER_LOGIN"));
check("audit rows carry actor, role and before/after snapshots", (await db.query("select count(*)::int c from audit_logs where action='PAYMENT_CONFIRMED' and actor_role is not null and before_data is not null and after_data is not null")).rows[0].c >= 1);
check("employer B audit shows nothing of A's relationship", (await eB.get("/api/review?type=audit")).json.logs.every((l) => !["EMPLOYMENT_REQUESTED", "PAYMENT_RECORDED", "WORK_SESSION_STARTED"].includes(l.action)));
const mA = (await eA.get("/api/metrics")).json, mB = (await eB.get("/api/metrics")).json;
check("employer metrics come from DB and are scoped", mA.overview.activeWorkers === 1 && mA.overview.certificatesIssued === 1 && mA.totalSessions === 2 && mB.overview.activeWorkers === 0 && mB.totalSessions === 0 && mB.overview.certificatesIssued === 0, { mA, mB });
const wm = (await wA.get("/api/metrics")).json;
check("worker metrics: 1 confirmed day, ₹400 paid, no admin fields", wm.confirmedWorkdays === 1 && wm.paidAmount === 400 && wm.overview === undefined, wm);

group("EXPORT");
const exA = await wA.get("/api/export");
check("worker export = own data only", exA.status === 200 && exA.json.account.id === wA.id && !JSON.stringify(exA.json).includes(wB.email) && !JSON.stringify(exA.json).includes(eB.email));
check("worker export excludes password hash / tokens", !/password_?hash|token_?hash|\$2[aby]\$/i.test(JSON.stringify(exA.json)));
const exE = await eA.get("/api/export");
check("employer export scoped, no raw GPS", exE.json.scope === "employer_scoped_data" && exE.json.workSessions.every((s) => s.startLatitude === undefined));
check("export via ?token= query is not accepted", (await new Client("x").get(`/api/export?token=${wA.cookie.split("=")[1]}`)).status === 401);
check("employer B export is empty of A's data", (await eB.get("/api/export")).json.workSessions.length === 0);

group("CONSENT / PROFILE / MISC");
check("worker toggles own consent", (await wA.post("/api/consents", { consentType: "certificate_public_verification", isAccepted: false })).status === 200);
check("employer cannot use worker consent API", (await eA.post("/api/consents", { consentType: "location_capture", isAccepted: true })).status === 403);
check("profile update works", (await wA.req("PATCH", "/api/auth/me", { occupation: "Chef", bio: "hi" })).json.profile?.occupation === "Chef");
check("health endpoint", (await new Client("x").get("/api/health")).json.ok === true);
check("errors never leak stack/SQL", !/at .*\(|select |insert |pg_|node_modules/i.test(JSON.stringify((await wA.post("/api/work-sessions", { action: "start", relationshipId: "not-a-uuid" })).json)));
check("removed endpoints are gone (seed / otp)", (await new Client("x").post("/api/seed", {})).status === 404 && (await new Client("x").post("/api/auth/otp", { action: "verify_otp", identifier: wA.email, otpCode: "123456" })).status === 404);
check("public user lookup removed", (await new Client("x").get("/api/auth/me?listEmployers=true")).status === 401);

group("CONCURRENCY");
const par = await Promise.all([1, 2, 3, 4, 5].map((i) => wA.post("/api/work-sessions", { action: "start", relationshipId: relId, idempotencyKey: `par-${run}-diff-${i}` })));
check("5 parallel starts → exactly ONE session created", par.filter((r) => r.status === 201).length === 1 && par.filter((r) => r.status === 409).length === 4, par.map((r) => r.status));
check("DB still has exactly one open session", (await db.query("select count(*)::int c from work_sessions where worker_id=$1 and status='open'", [wA.id])).rows[0].c === 1);
const openId = par.find((r) => r.status === 201).json.session.id;
await wA.post("/api/work-sessions", { action: "end", sessionId: openId });
const same = await Promise.all([1, 2, 3, 4, 5].map(() => wA.post("/api/work-sessions", { action: "start", relationshipId: relId, idempotencyKey: `par-${run}-same-key` })));
check("5 parallel starts, SAME key → one session, all return it", new Set(same.map((r) => r.json.session?.id)).size === 1 && same.every((r) => r.status === 200 || r.status === 201), same.map((r) => r.status));
await wA.post("/api/work-sessions", { action: "end", sessionId: same[0].json.session.id });

group("OFFLINE END (queued start + queued end)");
const OK = `offl-${run}-start`;
const os1 = await wA.post("/api/work-sessions", { action: "start", relationshipId: relId, wasOfflineSynced: true, deviceTimestamp: new Date(Date.now() - 90 * 60e3).toISOString(), idempotencyKey: OK });
const oe1 = await wA.post("/api/work-sessions", { action: "end", startIdempotencyKey: OK, wasOfflineSynced: true, deviceTimestamp: new Date(Date.now() - 30 * 60e3).toISOString(), idempotencyKey: `end-${OK}` });
check("end can reference a queued start by its idempotency key", oe1.json.session?.id === os1.json.session?.id && oe1.json.session.status === "pending_confirmation", oe1.json);
check("queued end: 60 min from device clock, needs_review", oe1.json.session.durationMinutes === 60 && oe1.json.session.syncStatus === "needs_review");
check("replayed queued end is idempotent", (await wA.post("/api/work-sessions", { action: "end", startIdempotencyKey: OK, idempotencyKey: `end-${OK}` })).json.duplicateIgnored === true);
check("worker B cannot end A's session via its start key", (await wB.post("/api/work-sessions", { action: "end", startIdempotencyKey: OK })).status === 404);

group("PASSWORD RESET / CHANGE");
const sha = (t) => crypto.createHash("sha256").update(t).digest("hex");
const gen = await new Client("x").post("/api/auth/forgot", { email: `nobody.${run}@example.com` });
const gen2 = await new Client("x").post("/api/auth/forgot", { email: wB.email });
check("forgot-password answers identically for unknown and known emails", gen.status === 200 && gen2.status === 200 && gen.json.message_en === gen2.json.message_en);
check("forgot-password stored only a HASHED token", (await db.query("select count(*)::int c from password_resets where user_id=$1", [wB.id])).rows[0].c === 1);
const tok = crypto.randomBytes(24).toString("base64url");
await db.query("insert into password_resets(user_id, token_hash, expires_at) values ($1,$2, now() + interval '20 minutes')", [wB.id, sha(tok)]);
check("reset with weak password rejected", (await new Client("x").post("/api/auth/reset", { token: tok, password: "short1" })).status === 400);
check("reset with bogus token rejected", (await new Client("x").post("/api/auth/reset", { token: "nope", password: "Brand-new-pass-77" })).json.error_code === "RESET_LINK_INVALID");
const wBSessionBefore = (await wB.get("/api/auth/me")).status;
const NEWPW = "Brand-new-pass-77";
check("reset with valid token succeeds", (await new Client("x").post("/api/auth/reset", { token: tok, password: NEWPW })).status === 200);
check("reset token is single-use", (await new Client("x").post("/api/auth/reset", { token: tok, password: "Another-pass-88" })).json.error_code === "RESET_LINK_INVALID");
check("all old sessions revoked after reset", wBSessionBefore === 200 && (await wB.get("/api/auth/me")).status === 401);
check("old password no longer works, new one does", (await new Client("x").post("/api/auth/login", { email: wB.email, password: PW })).status === 401 && (await new Client("x").post("/api/auth/login", { email: wB.email, password: NEWPW })).status === 200);
const tokExp = crypto.randomBytes(24).toString("base64url");
await db.query("insert into password_resets(user_id, token_hash, expires_at) values ($1,$2, now() - interval '1 minute')", [wB.id, sha(tokExp)]);
check("expired reset token rejected", (await new Client("x").post("/api/auth/reset", { token: tokExp, password: "Yet-another-99" })).json.error_code === "RESET_LINK_INVALID");

const eB2 = new Client("eB2"); await eB2.post("/api/auth/login", { email: eB.email, password: PW });
check("change password: wrong current password rejected", (await eB.post("/api/auth/password", { currentPassword: "Wrong-password-1", newPassword: "Changed-pass-123" })).status === 401);
check("change password: weak new password rejected", (await eB.post("/api/auth/password", { currentPassword: PW, newPassword: "abc" })).status === 400);
check("change password succeeds", (await eB.post("/api/auth/password", { currentPassword: PW, newPassword: "Changed-pass-123" })).status === 200);
check("change password keeps this session, revokes others", (await eB.get("/api/auth/me")).status === 200 && (await eB2.get("/api/auth/me")).status === 401);
check("change/reset are audited", (await db.query("select count(*)::int c from audit_logs where action in ('PASSWORD_CHANGED','PASSWORD_RESET_COMPLETED','PASSWORD_RESET_REQUESTED')")).rows[0].c >= 3);

group("RATE LIMITING");
let limited = false; const rl = `ratelimit.${run}@example.com`;
for (let i = 0; i < 12 && !limited; i++) limited = (await new Client("x").post("/api/auth/login", { email: rl, password: "Wrong-password-1" })).status === 429;
check("login is rate limited", limited);

await db.end();
console.log(`\n${passed} passed, ${failed} failed`);
if (failed) { console.log("FAILED:\n - " + failures.join("\n - ")); process.exit(1); }
