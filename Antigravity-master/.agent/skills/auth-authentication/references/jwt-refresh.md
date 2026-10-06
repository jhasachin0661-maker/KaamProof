# JWT & Refresh Token Patterns

## Token Architecture
- **Access Tokens**: Short-lived (15 minutes), signed using strong algorithms (RS256 / ES256). Store in memory or secure context.
- **Refresh Tokens**: Long-lived (7-30 days), stored in HTTP-only secure cookies with single-use rotation and reuse detection.
- **Revocation**: Maintain a database/Redis revocation list for invalidating refresh tokens on logout or password change.
