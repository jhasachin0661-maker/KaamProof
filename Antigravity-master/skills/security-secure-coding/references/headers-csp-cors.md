# Security Headers, CSP, CORS, Rate Limiting & Sensitive Data

## Essential Security Headers
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY` or `SAMEORIGIN`
- `Content-Security-Policy: default-src 'self'`
- `Strict-Transport-Security: max-age=31536000; includeSubDomains`

## CORS Rules
- Avoid `Access-Control-Allow-Origin: *` when credentials (`Access-Control-Allow-Credentials: true`) are sent.
- Explicitly validate origins against an origin allowlist.

## Rate Limiting & Abuse Prevention
- Apply rate limiters (e.g. `express-rate-limit`, `slowDown`) on auth endpoints (`/login`, `/signup`, `/forgot-password`, `/reset-password`).

## Sensitive Data Logging
- Mask or redact passwords, credit card numbers, JWTs, API tokens, and PII from application logs.
