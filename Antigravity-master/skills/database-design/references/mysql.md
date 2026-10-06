# MySQL Design Guidelines

## Version Check Requirement
Check MySQL version (MySQL 5.7 vs 8.0 vs 8.4 for CTEs and JSON validation).

## Best Practices
- Ensure InnoDB engine is specified.
- Use `utf8mb4` character set and `utf8mb4_unicode_ci` collation for proper Unicode support.
