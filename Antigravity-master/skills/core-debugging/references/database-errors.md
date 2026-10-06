# Database Error Guide

## Symptoms & Error Codes
- `ECONNREFUSED 127.0.0.1:5432`
- `PrismaClientInitializationError: Unable to connect to database`
- `Knex: Error connecting to database`

## Usual Causes
1. Database server process is not running locally.
2. Incorrect connection string (`DATABASE_URL`) in `.env`.
3. Pending unapplied database migrations.

## Diagnostic Commands
- Test database port / ping: `npx prisma db push --dry-run` or `psql $DATABASE_URL`

## Safe Fixes
- Verify database service status (`docker compose up db` or local service).
- Verify connection string environment variable in `.env`.
- Apply migrations to dev database (`npx prisma migrate dev`).
