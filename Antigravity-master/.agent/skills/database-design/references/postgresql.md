# PostgreSQL Design Guidelines

## Version Check Requirement
Check PostgreSQL version (e.g. Postgres 14 vs 16 vs 17 for pgvector and JSON query optimizations).

## Best Practices
- Use `uuid_generate_v4()` or `gen_random_uuid()` for primary keys when global uniqueness is required.
- Use `TIMESTAMPTZ` for all date/time columns.
- Use `JSONB` for unstructured attributes with GIN indexing.
