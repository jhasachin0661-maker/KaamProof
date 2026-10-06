# Authentication & Authorization Error Guide

## Symptoms & Error Codes
- `HTTP 401 Unauthorized`
- `HTTP 403 Forbidden`
- `JsonWebTokenError: invalid signature`
- `JWTExpired`

## Usual Causes
1. Missing or invalid `Authorization: Bearer <token>` header.
2. Mismatched secret key used for signing vs verifying tokens.
3. Expired token timestamp without refresh logic.

## Diagnostic Commands
- Test auth route with header: `curl -H "Authorization: Bearer $TOKEN" http://localhost:3000/api/protected`

## Safe Fixes
- Check `JWT_SECRET` environment variable across server components.
- Ensure token is passed in header and parsed correctly in middleware.
