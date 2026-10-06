# KaamProof Final Production Verification Plan

1. Baseline and security hygiene — complete baseline lint/typecheck/build; rotate exposed local database credential before any shared use.
2. Runtime database — pending isolated development database credentials; migrate, health-check, persistence and restart verification.
3. Product E2E — pending runtime DB; worker, employer, payments, disputes, certificates, QR verification and export.
4. Authorization and errors — pending runtime DB; two-user IDOR, role isolation and HTTP error matrix.
5. Browser and accessibility QA — pending running app/browser; required viewport, Hindi/English, offline/PWA and accessibility checks.
6. Production readiness — pending external configuration; rate limiting, monitoring, backup/restore and deployment evidence.
7. Documentation and final gate — pending preceding evidence; create docs/FINAL_LAUNCH_READINESS.md and report only evidence-backed statuses.
