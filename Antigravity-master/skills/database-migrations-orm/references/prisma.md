# Prisma ORM Guidelines

## Version Check Requirement
Check `@prisma/client` and `prisma` CLI versions in `package.json` (Prisma v4 vs v5 vs v6).

## Best Practices
- Run `npx prisma migrate dev` in local environment to generate and apply migrations.
- Use `npx prisma migrate deploy` in production environments.
- Include explicit relation fields (`@relation(fields: [...], references: [...])`) and index attributes (`@@index([field])`).
