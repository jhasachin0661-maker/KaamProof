// Development-only phone/password authorization smoke test.
// Requires a migrated isolated development database and a running app.
import "dotenv/config";
import pg from "pg";
import crypto from "node:crypto";

const BASE = process.env.BASE_URL || "http://127.0.0.1:3000";
if (process.env.NODE_ENV === "production" || process.env.DATABASE_TARGET !== "development") {
  throw new Error("Refusing IDOR test: set NODE_ENV != production and DATABASE_TARGET=development.");
}
if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required");

const db = new pg.Client({ connectionString: process.env.DATABASE_URL });
await db.connect();
const run = crypto.randomBytes(4).toString("hex");
const password = `Idor-Test-${run}-1`;
const phones = { workerA: `900${run}01`, workerB: `900${run}02`, employerA: `901${run}01`, employerB: `901${run}02` };
const ids = [];
let passed = 0;
let failed = 0;

function check(name, ok, detail = "") {
  if (ok) { passed++; console.log(`✓ ${name}`); }
  else { failed++; console.error(`✗ ${name}${detail ? ` — ${detail}` : ""}`); }
}

class Client {
  constructor() { this.cookie = ""; }
  async request(method, path, body) {
    const response = await fetch(`${BASE}${path}`, { method, headers: { ...(body ? { "content-type": "application/json" } : {}), ...(this.cookie ? { cookie: this.cookie } : {}) }, body: body ? JSON.stringify(body) : undefined });
    const setCookie = response.headers.get("set-cookie");
    if (setCookie) this.cookie = setCookie.split(";")[0];
    let json = null; try { json = await response.json(); } catch { /* no body */ }
    return { status: response.status, json };
  }
  post(path, body) { return this.request("POST", path, body); }
  get(path) { return this.request("GET", path); }
}

async function register(role, phone, name) {
  const client = new Client();
  const response = await client.post("/api/auth/register", { phone, password, confirmPassword: password, name: `[TEST-IDOR] ${name}`, role });
  if (response.status !== 200 && response.status !== 201) throw new Error(`register ${role} failed: ${response.status}`);
  ids.push(response.json.user.id);
  return { client, id: response.json.user.id, phone };
}

try {
  const workerA = await register("worker", phones.workerA, "Worker A");
  const workerB = await register("worker", phones.workerB, "Worker B");
  const employerA = await register("employer", phones.employerA, "Employer A");
  const employerB = await register("employer", phones.employerB, "Employer B");

  check("worker login/session", (await new Client().post("/api/auth/login", { phone: workerA.phone, password, role: "worker" })).status === 200);
  check("worker cannot access employer review", (await workerA.client.get("/api/review")).status === 403);
  check("worker B cannot see worker A data", (await workerB.client.get("/api/work-sessions")).json?.sessions?.length === 0);
  check("employer B cannot see employer A relationships", (await employerB.client.get("/api/employment")).json?.relationships?.length === 0);
  check("employer B cannot see employer A payments", (await employerB.client.get("/api/payments")).json?.payments?.length === 0);
  check("worker cannot access employer-only review", (await workerA.client.get("/api/review")).status === 403);

  const relation = await workerA.client.post("/api/employment", { action: "create", counterpartyIdentifier: employerA.phone, roleTitle: "Cook", wageAmount: 500, wageType: "daily", jobType: "Cook" });
  check("relationship creation for test fixture", relation.status === 201);
  const relationshipId = relation.json?.relationship?.id;
  check("employer B cannot respond to employer A relationship", (await employerB.client.post("/api/employment", { action: "respond", relationshipId, decision: "accept" })).status === 404);
  check("worker B cannot start on worker A relationship", (await workerB.client.post("/api/work-sessions", { action: "start", relationshipId })).status === 404);
  check("employer cannot start worker session", (await employerA.client.post("/api/work-sessions", { action: "start", relationshipId })).status === 403);
} finally {
  if (ids.length) await db.query("delete from users where id = any($1::uuid[])", [ids]);
  await db.end();
}

console.log(`IDOR phone-auth test: ${passed} passed, ${failed} failed`);
if (failed) process.exitCode = 1;
