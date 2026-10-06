# Indexing Design & Optimization

## Index Types
- **B-Tree**: Default for equality (`=`) and range queries (`<`, `>`, `BETWEEN`).
- **Composite Index**: Create indexes matching query filter order: equality columns first, followed by range/sort columns.
- **GIN Index**: Use for array containment, full-text search, and JSONB document field queries in PostgreSQL.
- **Partial Index**: Index filtered subsets (`WHERE is_active = true`) to save memory and storage overhead.
