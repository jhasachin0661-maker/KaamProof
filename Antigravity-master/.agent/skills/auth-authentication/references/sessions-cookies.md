# Session & Cookie Security Guidelines

## Cookie Flag Requirements
- `HttpOnly`: Prevents client-side JavaScript from accessing session cookies (mitigates XSS token theft).
- `Secure`: Ensures cookies are transmitted exclusively over encrypted HTTPS connections.
- `SameSite`: Set to `Lax` (default navigation protection) or `Strict` (strict cross-site protection) to mitigate CSRF attacks.

## Session Storage
- Store session state server-side in Redis or database stores with automatic TTL expiration.
