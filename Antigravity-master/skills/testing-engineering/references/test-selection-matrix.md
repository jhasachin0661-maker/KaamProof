# Test Selection Matrix

Map file change patterns to required test types.

| Changed File Pattern | Required Test Types | Priority |
|---|---|---|
| `src/utils/*.ts`, `src/lib/*.ts`, `src/helpers/*` | Unit tests | High |
| `src/services/*.ts`, `src/repositories/*` | Unit + Integration tests | High |
| `src/routes/*`, `src/api/*`, `src/app/api/*` | API tests (Supertest or equivalent) | High |
| `src/components/*.tsx`, `src/pages/*` | Component tests (Testing Library) | Medium |
| `prisma/schema.prisma`, `src/db/*` | Integration tests (test DB) | High |
| `src/middleware/*`, `src/auth/*` | Integration + API tests | High |
| Bug fix (any file) | Regression test reproducing original failure | High |
| Config / CI / Dockerfile | Smoke tests (build + start) | Medium |

## Decision Rules
1. **Every bug fix** must include a regression test that fails before the fix and passes after.
2. **Every new endpoint** must include at least one happy-path and one error-path API test.
3. **Every utility function** must have unit tests covering edge cases (empty input, null, boundary values).
4. **Never skip tests** just because the implementation "looks correct." Run and verify empirically.
