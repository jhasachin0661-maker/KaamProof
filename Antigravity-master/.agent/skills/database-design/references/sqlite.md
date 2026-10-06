# SQLite Guidelines

## Best Practices
- Enable foreign key constraint checking explicitly (`PRAGMA foreign_keys = ON;`).
- Use `TEXT` for ISO8601 timestamps and `INTEGER` for Unix epoch timestamps.
