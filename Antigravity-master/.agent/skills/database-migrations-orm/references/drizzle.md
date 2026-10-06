# Drizzle ORM Guidelines

## Version Check Requirement
Check `drizzle-orm` and `drizzle-kit` versions in `package.json`.

## Best Practices
- Define schemas in TypeScript using dialect builders (`pgTable`, `mysqlTable`, `sqliteTable`).
- Generate migrations using `npx drizzle-kit generate`.
- Apply migrations using `npx drizzle-kit migrate` or custom migration runner script.
