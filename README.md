# KaamProof

**A worker-owned digital work record for informal workers.** Attendance answers "did you work today?"; KaamProof helps answer "can you show your work history after the job is over?"

It keeps an evidence trail — employment relationships, versioned wage agreements, work sessions, payment records, disputes, monthly certificates with QR verification, and an audit log — that is **mutually confirmed** by worker and employer.

> **What it is not:** legal/court proof, a fraud detector, an identity verifier, a payment processor, or government-certified employment proof. AI output is a *review signal* to prioritise what a human looks at; it never decides who is telling the truth.

## Architecture

- Next.js 16 (App Router) + React + TypeScript + Tailwind
- PostgreSQL + Drizzle ORM (`src/db/schema.ts`, migrations in `drizzle/`)
- Auth: email + bcrypt password, opaque server-side session, only its SHA-256 stored, `HttpOnly` cookie
- API routes in `src/app/api/*` (thin HTTP layer) using shared helpers in `src/lib/` (`auth`, `access`, `wage`, `validate`, `errors`, `audit`, `rate-limit`, `crypto`)
- Pages: `/` landing, `/app` worker + employer portal, `/verify/[code]` public certificate check

## Roles (only two)

| Role | Can |
|---|---|
| **worker** | Only their own data: start/end work, history, payments (record/confirm), disputes they are party to, certificates (generate/revoke), export, consents, profile. |
| **employer** | Their own workers/relationships only: accept requests, propose/accept wages, confirm/dispute sessions, record/confirm payments, review disputes of their relationships, review signals, scoped audit trail, scoped export. "Admin" means *employer-scoped management* — there is **no global admin** and no admin registration. |

Registration accepts only `worker` or `employer`; anything else is rejected, and the DB has a `CHECK (role in ('worker','employer'))`.

## Features

- Explicit relationship: one side requests, the **other** side accepts; only then `active`.
- Wage agreements are versioned; a new version replaces the active one only after the other party accepts; history is kept.
- Work sessions: server timestamps are authoritative; duration and wage (daily/hourly/overtime) are calculated server-side and persisted. Client-sent durations are ignored.
- Offline queue (localStorage, no secrets): idempotency keys, retries, failed items stay queued; offline events are flagged `needs_review` and use the device clock only for duration.
- Payments are *records*: the recorder can never confirm their own entry.
- Disputes preserved, employer review is labelled as **not neutral**.
- Certificates: canonical (deep-sorted) JSON → SHA-256, random code `KP-XXXXXXXX`, QR → `/verify/<code>`; states `VERIFIED`, `NOT_FOUND`, `REVOKED`, `INTEGRITY_CHECK_FAILED`; public checks are logged and rate-limited; no PII/GPS exposed.
- Append-only audit log with actor, role, scope, before/after snapshots.
- Password reset by emailed one-time link (30 min, hashed token, single use, revokes all sessions) and in-app password change.
- Certificate sharing: native share sheet / WhatsApp / copy link (public verification link only).
- Offline "Kaam Khatam": an end can be queued even when the matching start is itself still queued (linked by the start's idempotency key).

## Local setup

```bash
npm install
cp .env.example .env        # set DATABASE_URL to a local Postgres
createdb kaamproof          # or any empty database
npm run db:migrate          # applies drizzle/*.sql
npm run dev                 # http://localhost:3000
```

Optional demo data (dev only, refused in production): `ALLOW_DEMO_SEED=true npm run db:seed:demo` (prints a random password).

## Environment variables

| Name | Required | Notes |
|---|---|---|
| `DATABASE_URL` | yes | PostgreSQL URL. Supabase: use the pooled (port 6543) URL with `?sslmode=require` on Vercel. |
| `NEXT_PUBLIC_SITE_URL` | no | Used for Open Graph metadata. |
| `DB_POOL_MAX` | no | Default 5. |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | recommended in production | Shared rate limiting across instances. Falls back to in-memory if unset. |
| `RESEND_API_KEY`, `MAIL_FROM` | for password-reset emails | Without them no email is sent (in development the link is printed to the server console). |

No other secrets are needed: session tokens are random, not signed with a shared key.

## Database migration

Migrations are deterministic SQL files in `drizzle/` (`0000_init.sql`, `0001_password_resets.sql`). If `drizzle-kit migrate` exits silently on a Supabase *transaction pooler* URL (port 6543), paste the `.sql` files in order into the Supabase SQL Editor instead (each once). Production uses `npm run db:migrate` (`drizzle-kit migrate`) — **never** `drizzle-kit push`. After editing `schema.ts`: `npm run db:generate`, review the SQL, commit it.

## Production build & deployment (Vercel + Supabase)

1. Create a Supabase project; copy the **pooled** connection string.
2. Apply migrations from your machine: `DATABASE_URL="<supabase url>" npm run db:migrate`.
3. Import the repo in Vercel; set `DATABASE_URL` (and `NEXT_PUBLIC_SITE_URL`). Build command `npm run build`.
4. Check `https://<your-app>/api/health` returns `{"ok":true}`.

Alternative: Render (Web Service, build `npm install && npm run build`, start `npm run start`, plus a Postgres instance; run `npm run db:migrate` as a pre-deploy command).

Local production check: `npm run build && npm run start`.

## Testing

`npm run start` (against a migrated DB), then in another shell:

```bash
DATABASE_URL=... BASE_URL=http://127.0.0.1:3000 npm run test:e2e
```

153 checks cover auth, cookies, session expiry, password reset/change, role escalation, CSRF, cross-user/cross-employer isolation, employment, agreement versioning, sessions (idempotency, concurrency, server duration, offline start+end), payments, disputes, certificates (tamper/revoke), audit, metrics and export. Restart the server between runs (in-memory rate limits).

## Security model

- Identity comes only from the session cookie; ids/roles in bodies or query strings are never trusted. Every mutation checks resource ownership server-side (non-parties get 404).
- `HttpOnly`, `SameSite=Lax`, `Secure` in production; no tokens/roles in localStorage; SHA-256 token hashing; 7-day expiry; logout revokes.
- bcrypt (cost 12) with a dummy compare for unknown emails; generic login errors; password policy ≥10 chars with letters + digits.
- CSRF defence: SameSite + `Origin`/`Sec-Fetch-Site` check on mutations.
- DB constraints: one open session per worker (partial unique index), one live relationship per pair, role check.
- Structured errors (`error_code`, `message_en`, `message_hi`); 500s never leak internals.
- Security headers via `next.config.ts`; private pages are `noindex`; `/api`, `/app`, `/verify` are disallowed in `robots.txt`.

## Known limitations

- Rate limiting is shared only when Upstash is configured; otherwise it is per-instance memory.
- Password-reset email needs a Resend account (or swap `src/lib/mailer.ts`). No email *verification* at signup yet.
- Employer resolving disputes is not neutral by nature; no independent mediator role yet.
- GPS is supporting evidence and can be spoofed; no spoof detection.
- Accepting an employment request accepts the initially proposed wage terms.
- The portal (`src/app/app/page.tsx`) is still a large component (types and two components were extracted; worker/employer portals should be split next).
- The UI has not been driven by an automated browser test (API behaviour is covered by the 153 checks); test the flow manually in a browser before launch.
- Not audited by a third party.

## Future improvements

Email verification, split portal components, Playwright UI tests, Hindi/English i18n coverage for new strings, monthly certificate scheduler, NGO/cooperative onboarding role, accessibility audit with real devices.
