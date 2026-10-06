# API Resilience, Rate Limiting & Idempotency

## Idempotency
- Require `Idempotency-Key` header on state-modifying POST requests (e.g. charge creation, order placement).
- Cache response by idempotency key to return identical payload on duplicate retry attempts.

## Rate Limiting Headers
- Send standard headers:
  - `X-RateLimit-Limit`: Maximum requests per window.
  - `X-RateLimit-Remaining`: Remaining requests.
  - `X-RateLimit-Reset`: Unix timestamp when limit resets.
