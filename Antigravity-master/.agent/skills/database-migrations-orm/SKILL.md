---
name: database-migrations-orm
description: Manage database migrations, seeds, ORM mappings, and transaction execution. Trigger whenever writing ORM queries, executing migrations, altering database tables, seed scripts, or optimizing database queries, even if migrations are not explicitly named. Enforces version checks, forward+rollback safety, and environment risk gating.
metadata:
  category: database
  priority: P1
  layer: build
  version: 0.1.0
  reads_from: database-design
  risk_max: CRITICAL
---

# Database Migrations & ORM

## Purpose
Generate, validate, and execute database schema migrations, seed scripts, ORM model mappings, database transactions, connection pooling, and query tuning. Enforces version checks, forward and rollback migration safety, and environment risk gating.

## When NOT to use
- Do not use for high-level database engine selection or architectural schema design without writing migration scripts (use `database-design`).
- Do not execute destructive schema alterations in production without dry-run validation, backup verification, and explicit CRITICAL approval.

## Inputs
- ORM schemas (Prisma, Drizzle, SQLAlchemy, Mongoose, Supabase), migration history files, target environment settings (`environment.target`), and `.agent/context/project-context.json`.

## Procedure
1. **Version Check**: Check ORM framework and migration tool versions in package manifests (Prisma v4 vs v5 vs v6, Drizzle Kit v0.20+, SQLAlchemy 1.4 vs 2.0, Alembic). Verify version-sensitive migration syntax against official documentation or `core-research`.
2. **ORM Pattern Selection**: Match existing ORM models (Prisma, Drizzle, SQLAlchemy, Mongoose, Supabase). Refer to `references/prisma.md`, `references/drizzle.md`, `references/sqlalchemy-alembic.md`, `references/mongoose.md`, `references/supabase.md`.
3. **Safe Migration Construction**: Every migration MUST provide both a forward (`up`) migration and a clean rollback (`down`) migration script. Refer to `references/safe-migrations.md`.
4. **Expand/Contract Pattern**: For destructive column/table renames or type changes, use expand/contract pattern across releases to avoid downtime.
5. **Transactions & Concurrency**: Enforce atomic database transactions, explicit lock timeouts, isolation levels, and connection pool sizing. Refer to `references/transactions-concurrency.md`.
6. **Query Optimization**: Tune ORM queries to prevent N+1 select problems and audit query execution plans. Refer to `references/query-tuning.md`.
7. **Environment Risk Classification & Gating**:
   - **Local Environment**: `LOW` or `MEDIUM` risk. Fully autonomous execution.
   - **Shared / Staging Environment**: `HIGH` risk approval required before executing migrations.
   - **Production Environment**: `CRITICAL` risk approval required. Requires dry-run migration SQL output, database backup verification, rollback script validation, and explicit human authorization.

## Validation
- ORM version verified in package manifests prior to migration generation.
- Both forward (`up`) and rollback (`down`) scripts exist and validate cleanly.
- Production migrations carry explicit CRITICAL approval and dry-run SQL verification.

## Failure handling
- If a migration fails execution, immediately invoke rollback script (`down`), capture migration log errors, and route to `core-debugging`. Never force-apply broken migrations.

## Approval touchpoints
- Refer to `references/approval-levels.md`.
- `LOW` / `MEDIUM`: Local migration generation and execution against local dev databases.
- `HIGH`: Executing migrations against shared/staging environment databases.
- `CRITICAL`: Executing any migration or DDL statement against production database environments.

## Output
- Handoff file in `.agent/context/handoffs/NN-database-migrations-orm.md` per `references/output-contract.md`.
- Migration files created/updated and execution status log.

## References index
- `references/prisma.md`: Prisma ORM schema modeling, migrations, and client usage.
- `references/drizzle.md`: Drizzle ORM schemas, Drizzle Kit migrations, and query builders.
- `references/sqlalchemy-alembic.md`: SQLAlchemy 2.0 models and Alembic migration scripts.
- `references/mongoose.md`: Mongoose schema models, middleware, and MongoDB connections.
- `references/supabase.md`: Supabase CLI migrations, RLS policies, and SQL scripts.
- `references/safe-migrations.md`: Forward/rollback migration rules and expand/contract pattern.
- `references/transactions-concurrency.md`: ACID transactions, connection pooling, and locking strategies.
- `references/query-tuning.md`: Fixing N+1 queries, indexing, and query execution plan analysis.
- `references/context-contract.md`: Schema for project context.
- `references/output-contract.md`: Standard handoff output structure.
- `references/approval-levels.md`: Operational risk levels.
- `references/untrusted-content.md`: Untrusted content handling rules.
