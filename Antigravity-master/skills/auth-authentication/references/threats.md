# Authentication Threat Notes Checklist

## Mandatory Threat Analysis Categories
1. **Credential Stuffing / Brute Force**: Mitigated via rate limiting and IP throttling.
2. **Session Hijacking / XSS Theft**: Mitigated via `HttpOnly` and `Secure` cookie flags.
3. **Cross-Site Request Forgery (CSRF)**: Mitigated via `SameSite=Lax/Strict` and anti-CSRF tokens.
4. **OAuth State / Replay Attacks**: Mitigated via PKCE and random `state` parameters.
5. **Token Leaks**: Mitigated via zero hardcoded secrets and environment variable configuration.
