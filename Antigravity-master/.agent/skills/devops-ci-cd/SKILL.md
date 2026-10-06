---
name: devops-ci-cd
description: Build, optimize, and maintain GitHub Actions CI/CD pipelines, build matrices, dependency caching, environment promotion, CI secret handling, pinned action SHA versions, and least-privilege workflow permissions. Trigger whenever editing workflow YAML, configuring CI jobs, or setting up deployment pipelines, even if CI/CD is not named.
metadata:
  category: devops
  priority: P1
  layer: deliver
  version: 0.1.0
  reads_from: testing-engineering, git-workflow
  risk_max: HIGH
---

# DevOps CI/CD

## Purpose
Design, construct, and harden GitHub Actions CI/CD pipelines for automated testing, building, and environment promotion while enforcing least-privilege workflow permissions, action version pinning by commit SHA, secure secret handling, and optimal build caching. Editing CI configurations is classified as `MEDIUM` risk; configuring workflows that execute deployment ops is `HIGH` risk.

## When NOT to use
- Do not use for local container Dockerfile/Compose authoring (use `devops-containers`).
- Do not use for managing cloud infrastructure hosting resources directly (use `cloud-deployment`).

## Inputs
- GitHub workflow files (`.github/workflows/*.yml`), repository build/test scripts, `.agent/context/project-context.json`.

## Procedure
1. **Pipeline Architecture & Workflow Design**:
   - Construct GitHub Actions workflows for continuous integration (lint, test, build, scan) and deployment promotion. Refer to `references/github-actions.md`.
2. **Least-Privilege Permissions**:
   - Enforce top-level `permissions: read-all` or explicit minimal scopes (e.g. `contents: read`, `id-token: write` for OIDC) in every workflow file.
3. **Action Version Pinning**:
   - Pin third-party actions to full 40-character commit SHAs instead of mutable tags (e.g. `uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2`).
4. **Build Caching & Matrix Builds**:
   - Implement dependency caching (`actions/cache` or setup action caching options) for npm, pip, cargo, and composer to minimize pipeline execution times. Refer to `references/caching.md`.
   - Utilize matrix strategies (`strategy.matrix`) for cross-version and cross-OS testing.
5. **Secrets & OIDC Handling**:
   - Store CI credentials securely in GitHub Secrets. Use OpenID Connect (OIDC) federated authentication for cloud deployments rather than long-lived cloud keys. Refer to `references/ci-secrets.md`.
6. **Environment Promotion**:
   - Configure environment protection rules (staging vs production) with manual approval gates and environment-specific secrets. Refer to `references/promotion.md`.

## Validation
- GitHub Actions workflow syntax validated via `actionlint` or JSON schema linter (exit code 0).
- All third-party actions pinned to 40-character SHAs with permissions explicitly declared.
- Secrets sanitized and zero hardcoded credentials present.

## Failure handling
- If CI build or syntax fails, parse workflow run logs, correct YAML formatting or permissions scope, and re-validate workflow file.

## Approval touchpoints
- Refer to `references/approval-levels.md`.
- `MEDIUM`: Editing non-deploying CI testing, linting, or build workflow files.
- `HIGH`: Editing workflows that deploy to staging/production or handle cloud credentials. Requires human review.

## Output
- Handoff file in `.agent/context/handoffs/NN-devops-ci-cd.md` per `references/output-contract.md`.
- Validated GitHub Actions workflow files in `.github/workflows/`.

## References index
- `references/github-actions.md`: Workflow syntax, job triggers, matrices, and SHA pinning rules.
- `references/caching.md`: Package manager dependency caching strategies and key eviction.
- `references/promotion.md`: Environment promotion pipelines, concurrency control, and gate protection.
- `references/ci-secrets.md`: Secret masking, environment secret isolation, and OIDC federated authentication.
- `references/context-contract.md`: Schema for project context.
- `references/output-contract.md`: Standard handoff output structure.
- `references/approval-levels.md`: Operational risk levels.
- `references/untrusted-content.md`: Untrusted content handling rules.
