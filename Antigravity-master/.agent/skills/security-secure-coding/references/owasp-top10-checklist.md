# OWASP Top 10 & ASVS Security Checklist

## Checklist Overview
Use this checklist when performing defensive security reviews on application diffs and source code.

### A01: Broken Access Control
- [ ] Ensure endpoints check user authorization before returning data or executing actions.
- [ ] Verify object IDs (GUIDs/integers) are not accessible without ownership or role checks (IDOR).
- [ ] Check CORS settings do not allow arbitrary origins with credentials.

### A02: Cryptographic Failures
- [ ] Verify sensitive data (passwords, tokens, PII) is encrypted at rest and in transit (TLS 1.2+).
- [ ] Check password hashing uses strong algorithms (bcrypt, argon2, pbkdf2) with salt.
- [ ] Ensure hardcoded API keys, JWT secrets, or private keys do not exist in source files.

### A03: Injection
- [ ] Verify SQL queries use parameterized interfaces or ORM bindings (no string concatenation).
- [ ] Check shell execution commands avoid raw user input in sub-shells.
- [ ] Validate expression evaluators and template engines disable unsafe evaluation.

### A04: Insecure Design
- [ ] Rate limiting applied on authentication, password reset, and sensitive endpoints.
- [ ] Failure recovery flows do not leak internal credentials or state.

### A05: Security Misconfiguration
- [ ] Debug modes disabled in non-development environments.
- [ ] Default credentials replaced.
- [ ] Security headers set (`X-Content-Type-Options`, `X-Frame-Options`, `Content-Security-Policy`).

### A06: Vulnerable and Outdated Components
- [ ] Dependencies scanned for known CVEs.
- [ ] Unused dependencies removed.

### A07: Identification and Authentication Failures
- [ ] Session tokens generated securely with high entropy.
- [ ] Session cookies set with `HttpOnly`, `Secure`, and `SameSite` attributes.
- [ ] Protection against brute-force attacks on login routes.

### A08: Software and Data Integrity Failures
- [ ] Insecure deserialization prevented (avoid untrusted `eval`, `pickle`, `unserialize`).
- [ ] CI/CD pipeline step signatures and lockfiles validated.

### A09: Security Logging and Monitoring Failures
- [ ] Log login attempts, access failures, and privilege escalations.
- [ ] Sensitive data (passwords, credit cards, tokens) masked or omitted from logs.

### A10: Server-Side Request Forgery (SSRF)
- [ ] Outgoing requests use strict allowlists for protocols, hosts, and ports.
- [ ] Internal metadata IPs (`169.254.169.254`, `127.0.0.1`, `::1`, private subnets) blocked.
