---
name: database-design
description: Design relational and NoSQL database schemas, indexes, and data models. Trigger whenever choosing database engines, modeling entities, designing table schemas, configuring indexes, or planning data retention and PII tags, even if database is not explicitly named. Design only; applies nothing to non-local databases.
metadata:
  category: database
  priority: P1
  layer: build
  version: 0.1.0
  reads_from: core-requirements-planning, arch-system-design
  risk_max: LOW
---

# Database Design

## Purpose
Design relational and NoSQL data models, table schemas, primary/foreign key constraints, indexes, data retention policies, and PII tagging strategies. This skill performs architectural design and schema specification only; it applies no migrations to remote or production databases.

## When NOT to use
- Do not use for executing live database migrations, DDL scripts, or ORM migrations on remote/staging/production databases (use `database-migrations-orm`).
- Do not use for writing frontend component rendering code.

## Inputs
- Entity requirements, expected query patterns, data volume estimates, and `.agent/context/project-context.json`.

## Procedure
1. **Version Check**: Check target database engine version from project context (e.g. PostgreSQL 14 vs 16, MySQL 8.0 vs 8.4, MongoDB 6 vs 7, Redis 7). Verify version-sensitive features (JSON path expressions, vector extensions, index types) against official documentation or `core-research`.
2. **Engine Selection**: Evaluate requirements against engine capabilities (PostgreSQL, MySQL, SQLite, SQL Server, MongoDB, Redis, DynamoDB, Firebase). Refer to `references/postgresql.md`, `references/mysql.md`, `references/sqlite.md`, `references/sqlserver.md`, `references/mongodb.md`, `references/redis.md`, `references/dynamodb.md`, `references/firebase.md`.
3. **Schema Modeling**: Apply normalization (3NF) for transactional RDBMS or single-table / document modeling patterns for NoSQL. Refer to `references/schema-patterns.md`.
4. **Index Design & Optimization**: Specify B-Tree, Hash, GIN, GiST, or TTL indexes based on expected query filters and join keys. Refer to `references/indexing.md`.
5. **Constraints & Integrity**: Enforce foreign keys, unique constraints, check constraints, default values, and non-nullability.
6. **PII Flagging & Retention**: Identify fields containing Personally Identifiable Information (PII) or sensitive health/financial data. Tag fields for encryption at rest and define data retention / purging strategies.
7. **Design Scope Safety**: Design schemas in specification documents or ER diagrams. Never attempt DDL execution on non-local databases.

## Validation
- Target database engine version verified before selecting schema feature set.
- All foreign keys, unique indexes, and primary keys explicitly defined.
- PII data fields explicitly tagged in schema documentation.

## Failure handling
- If conflicting query access patterns require incompatible normalization tradeoffs, document the compromise rationale clearly in the design output.

## Approval touchpoints
- Refer to `references/approval-levels.md`.
- `LOW`: Designing schemas, writing ER diagrams, specifying indexes. Fully autonomous.

## Output
- Handoff file in `.agent/context/handoffs/NN-database-design.md` per `references/output-contract.md`.
- Schema design specification document containing DDL definitions and indexing plan.

## References index
- `references/postgresql.md`: PostgreSQL database features, data types, and index strategies.
- `references/mysql.md`: MySQL storage engines (InnoDB) and indexing guidelines.
- `references/sqlite.md`: SQLite embedded database design and constraints.
- `references/sqlserver.md`: Microsoft SQL Server data modeling.
- `references/mongodb.md`: MongoDB document modeling and indexing.
- `references/redis.md`: Redis data structures, caching, and persistence models.
- `references/dynamodb.md`: DynamoDB single-table design and GSIs.
- `references/firebase.md`: Firebase Firestore document/collection rules.
- `references/indexing.md`: B-Tree, GIN, GiST, Partial, and Composite index design.
- `references/schema-patterns.md`: Normalization vs Denormalization and ER modeling.
- `references/context-contract.md`: Schema for project context.
- `references/output-contract.md`: Standard handoff output structure.
- `references/approval-levels.md`: Operational risk levels.
- `references/untrusted-content.md`: Untrusted content handling rules.
