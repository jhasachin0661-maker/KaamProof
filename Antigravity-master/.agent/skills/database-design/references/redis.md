# Redis Guidelines

## Best Practices
- Select appropriate data structures: Hashes for objects, Sets for unique collections, Sorted Sets (ZSET) for leaderboards/time-series.
- Explicitly configure TTL (Time-To-Live) on cache keys.
