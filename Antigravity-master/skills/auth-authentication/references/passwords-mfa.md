# Password Security & Multi-Factor Authentication (MFA)

## Hashing Algorithms
- **Argon2id**: Recommended primary hashing algorithm (t=2, m=19MiB, p=1).
- **bcrypt**: Secondary standard (work factor >= 12).
- **Zero Custom Crypto**: Never implement custom hashing logic.

## MFA Implementation
- Implement Time-based One-Time Password (TOTP, RFC 6238) using verified libraries.
- Store MFA backup codes encrypted at rest.
