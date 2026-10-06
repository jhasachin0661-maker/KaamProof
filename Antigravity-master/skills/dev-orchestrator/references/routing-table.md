# Change Signal Routing Table

The orchestrator routes tasks and modified file sets to specific skills based on change signals.

| Change Signal / File Patterns | Target Skill Sequence | Gating & Risk Checks |
|---|---|---|
| `*.sql`, `migrations/*`, `schema.prisma`, `drizzle.config.*` | `database-migrations-orm` -> `quality-release-gate` | DB check in gate. Risk level `CRITICAL` for schema changes or data migrations. |
| `auth/*`, `session/*`, `middleware.ts`, `tokens/*` | `auth-authentication` / `auth-authorization` -> `security-secure-coding` | Requires `REQUIRES HUMAN REVIEW` flag on handoffs. Risk level `HIGH` or `CRITICAL`. |
| `*.tsx`, `*.vue`, `*.css`, `templates/*` | `frontend-accessibility` -> `testing-e2e-browser` -> `uiux-design-critique` | Visual regression & accessibility checks. Risk level `LOW` / `MEDIUM`. |
| `package.json`, `requirements.txt`, `Cargo.toml`, lockfiles | `core-dependency-management` -> `security-scanning` | Dependency vulnerability scan. Risk level `MEDIUM` for version bumps. |
| `Dockerfile`, `docker-compose.yml`, `.github/workflows/*`, `*.tf` | `devops-containers` / `devops-ci-cd` / `devops-iac-kubernetes` | Risk level check `HIGH` or `CRITICAL` for CI/IaC changes. |
| `api/*`, `routes/*`, `handlers/*` | `security-secure-coding` -> `api-design` -> `testing-engineering` | API contract validation and automated integration tests. Risk level `MEDIUM`. |

## Routing Rule Examples
1. **Database Schema Update**: If diff contains `prisma/migrations/20261003_init/migration.sql`, route to `database-migrations-orm`, classify risk as `CRITICAL`, and pause for human approval if targeting shared/production DB.
2. **Authentication Middleware Edit**: If diff contains `src/middleware/auth.ts`, route to `auth-authentication` and `security-secure-coding`. Mark verification status as `REQUIRES HUMAN REVIEW`.
3. **UI Component Addition**: If diff contains `src/components/Button.tsx`, route to `frontend-accessibility` and `testing-e2e-browser`.
