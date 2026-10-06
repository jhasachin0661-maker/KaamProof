# Transactions, Concurrency & Locking

## ACID Transactions
- Wrap multi-table state modifications in explicit database transaction blocks (`BEGIN ... COMMIT / ROLLBACK`).
- Set appropriate isolation levels (`READ COMMITTED` default vs `SERIALIZABLE` for financial balances).
- Set lock timeouts (`SET lock_timeout = '5s';`) to prevent deadlock cascades in high-concurrency environments.

## Connection Pooling
- Configure connection pool bounds (`min` and `max` connections) matching server worker concurrency.
