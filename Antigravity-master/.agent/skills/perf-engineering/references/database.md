# Database Performance & Indexing Guidelines

## Analyzing Query Plans (`EXPLAIN ANALYZE`)
Identify Seq Scans (Sequential Scans) on large tables and high total cost operators.

```sql
EXPLAIN (ANALYZE, BUFFERS)
SELECT * FROM orders WHERE tenant_id = 't_123' AND status = 'pending';
```

## Index Design Rules
1. Add composite B-Tree indexes for frequent multi-column `WHERE` queries:
   ```sql
   CREATE INDEX idx_orders_tenant_status ON orders (tenant_id, status);
   ```
2. Eliminate N+1 ORM queries by using JOIN FETCH / eager loading.
3. Select specific columns (`SELECT id, name`) instead of `SELECT *`.
