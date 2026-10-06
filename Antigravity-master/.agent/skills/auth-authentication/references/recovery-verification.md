# Account Recovery & Email Verification

## Secure Recovery Protocols
- Use single-use, cryptographically secure random tokens (`crypto.randomBytes(32)`).
- Enforce short expiration limits (e.g. 15-30 minutes) on password reset links.
- Rate-limit password reset request endpoints to prevent email enumeration or spam attacks.
