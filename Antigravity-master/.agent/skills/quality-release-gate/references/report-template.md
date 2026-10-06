# Quality Release Gate Report Template

```markdown
# Quality Release Gate Audit Report

| Group | Check Name | Status | Evidence |
|---|---|---|---|
| Code | Build Compilation | VERIFIED | npm run build (exit code 0) |
| Code | Linter & Typecheck | VERIFIED | npm run lint (exit code 0) |
| Security | Secret Scan | VERIFIED | Staged git diff checked (0 secrets found) |
| UI | Responsive Design | N/A | Project profile is REST API |
| Backend | API Schema Validation | VERIFIED | OpenAPI schema validation (exit code 0) |
| Database | Migration Integrity | N/A | No DB migration changed in slice |
| Deployment | Environment Config | VERIFIED | .env.example updated with new variables |
| Docs | README & Setup Docs | VERIFIED | README.md lines 45-60 updated |

## Gate Verdict: PASSED / INCOMPLETE
```
