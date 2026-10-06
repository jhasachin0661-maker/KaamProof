# Caching & CDN Acceleration Guidelines

## 1. HTTP Cache-Control Headers
- Immutable assets: `Cache-Control: public, max-age=31536000, immutable`
- Dynamic API responses: `Cache-Control: private, no-cache` or `stale-while-revalidate=60`

## 2. In-Memory Redis Caching
- Cache expensive read queries with short TTLs (e.g. 60 seconds).
- Invalidate cache explicitly upon write/update operations (Cache Aside pattern).
