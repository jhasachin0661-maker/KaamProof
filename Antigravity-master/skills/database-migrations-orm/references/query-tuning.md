# Query Tuning & Optimization

## N+1 Query Elimination
- Detect N+1 ORM query patterns (executing database query per record in loop).
- Use eager loading / batch fetching (`include`, `preload`, `select_related`, `prefetch_related`).

## EXPLAIN ANALYZE
- Run `EXPLAIN ANALYZE` on slow queries to identify sequential table scans (`Seq Scan`) lacking composite or B-Tree indexes.
