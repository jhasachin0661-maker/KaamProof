---
name: config-env-secrets
description: Manage environment variables, configuration schemas, secret hygiene, and .env files safely. Use whenever dealing with .env files, missing environment variables, API keys, application config, environment parity, or works on my machine errors, even if the user does not explicitly name config.
metadata:
  category: config
  priority: P0
  layer: build
  version: 0.1.0
  reads_from: core-repo-discovery
  risk_max: MEDIUM
---

# Config Env Secrets

## Purpose
Safely discover, validate, and manage application environment variables and secrets while enforcing secret hygiene and environment parity without committing secret values.

## When NOT to use
- Do not use for general application code edits unrelated to configuration or secrets.

## Inputs
- Workspace source code and `.agent/context/project-context.json`.

## Procedure
1. **Env Var Usage Audit**: Run `python scripts/find_env_usage.py` to identify all referenced environment variables across codebase files.
2. **Template Generation**: Produce or update `.env.example` containing variable NAMES ONLY and empty/dummy placeholders. Never write real secret values to `.env.example`.
3. **Configuration Schema Validation**: Implement startup configuration validation (e.g., Zod for TypeScript, Pydantic for Python) following `references/config-schemas.md`.
4. **Gitignore Audit**: Check `.gitignore` to ensure `.env`, `.env.local`, and private key files are strictly gitignored.
5. **Secret Exposure Audit**: Scan repository files for accidentally committed API keys or credentials. If secrets are found in committed code, STOP immediately and report to user. Refer to `references/secret-hygiene.md`.
6. **Environment Parity**: Document environment variable expectations for `local`, `staging`, and `production` targets.

## Validation
- Gitignore check: `.gitignore` contains `.env` rule.
- Env usage audit: `python scripts/find_env_usage.py` executed (exit code 0).
- Template safety: `.env.example` contains variable NAMES ONLY without actual secret values.

## Failure handling
- If committed secrets are found in git history, halt operations and issue a security finding report. Do not attempt history rewrites or secret purging without explicit `HIGH` risk human approval.

## Approval touchpoints
- Refer to `references/approval-levels.md` and `references/secret-hygiene.md`.
- `MEDIUM`: Updating `.env.example`, adding startup validation.
- `HIGH`: Purging committed secrets from git history or modifying staging/production envs.

## Output
- Handoff file in `.agent/context/handoffs/NN-config-env-secrets.md` per `references/output-contract.md`.
- Updated `.env.example` and startup config schema files.

## References index
- `references/config-schemas.md`: Patterns for startup configuration validation (Zod, Pydantic, etc.).
- `references/secret-hygiene.md`: Rules for secret handling, gitignore rules, and secret removal.
- `references/context-contract.md`: Schema for project context.
- `references/output-contract.md`: Standard handoff output structure.
- `references/approval-levels.md`: Risk levels and escalation rules.
- `references/untrusted-content.md`: Untrusted content and anti-tamper safety rules.
