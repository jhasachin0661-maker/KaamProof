---
name: core-dependency-management
description: Audit, update, and manage project dependencies across npm, pnpm, yarn, pip, uv, poetry, cargo, and composer. Trigger whenever checking outdated packages, fixing vulnerabilities, verifying lockfiles, upgrading major versions, or removing unused packages, even if dependency management is not named.
metadata:
  category: core
  priority: P1
  layer: build
  version: 0.1.0
  reads_from: core-repo-discovery, testing-engineering
  risk_max: MEDIUM
---

# Core Dependency Management

## Purpose
Safely manage, audit, and upgrade software dependencies across multiple package ecosystems (npm, pnpm, yarn, pip, uv, poetry, cargo, composer) while maintaining lockfile integrity, preventing breaking changes, ensuring license compliance, and verifying build/test pass states.

## When NOT to use
- Do not use for writing application features or business logic (use `core-implementation`).
- Do not use for system-level OS package management or Docker image builds (use `devops-containers`).

## Inputs
- Package manifests (`package.json`, `pyproject.toml`, `Cargo.toml`, `composer.json`, `requirements.txt`).
- Lockfiles (`package-lock.json`, `pnpm-lock.yaml`, `yarn.lock`, `poetry.lock`, `Cargo.lock`, `composer.lock`).
- `.agent/context/project-context.json`.

## Procedure
1. **Ecosystem & Tool Detection**: Identify package manager from manifests and lockfiles. Refer to ecosystem specific references: `references/npm.md`, `references/python.md`, `references/cargo.md`, `references/composer.md`.
2. **Audit & Analysis**:
   - Check for outdated packages, security vulnerabilities (SCA), incompatible peer dependencies, and unused dependencies.
   - Run ecosystem audit commands (`npm audit`, `pip-audit`, `cargo audit`, `composer audit`).
3. **Small Batch Upgrades**:
   - Never upgrade all dependencies at once. Upgrade in small logical batches (e.g., minor/patch updates first, major updates individually).
   - Refer to `references/upgrade-playbook.md` for upgrade order and strategies.
4. **Major Version Handling**:
   - Before upgrading a major version, read breaking change notes and changelogs.
   - Inspect code for deprecated API usage and refactor before upgrading.
5. **License & Compliance Check**:
   - Verify licenses of new/updated packages against allowed open-source licenses (MIT, Apache-2.0, BSD, ISC). Flag copyleft licenses (GPL/AGPL) for review.
6. **Feature Flag & Deprecation Cleanup**:
   - Identify obsolete feature flags or legacy compatibility shims associated with retired dependencies.
7. **Empirical Validation**:
   - Verify lockfile updates match updated manifests.
   - Run test suite and build verification after every batch upgrade.

## Validation
- Audit commands run with zero high/critical vulnerabilities.
- Lockfiles updated and in sync with manifests (exit code 0).
- Test suite passes after each batch upgrade (exit code 0).

## Failure handling
- If a dependency upgrade breaks tests or build, revert the individual batch immediately (`git checkout -- <lockfile> <manifest>`), record incompatible versions, and isolate the breaking package.

## Approval touchpoints
- Refer to `references/approval-levels.md`.
- `MEDIUM`: Dependency upgrades, manifest modifications, and lockfile updates. Git checkpoint created before editing.

## Output
- Handoff file in `.agent/context/handoffs/NN-core-dependency-management.md` per `references/output-contract.md`.
- Summary of upgraded packages, security advisories resolved, license audit results, and test status.

## References index
- `references/npm.md`: Node.js / JavaScript package ecosystem guidance (npm, pnpm, yarn).
- `references/python.md`: Python package ecosystem guidance (pip, uv, poetry).
- `references/cargo.md`: Rust Cargo package ecosystem guidance.
- `references/composer.md`: PHP Composer package ecosystem guidance.
- `references/upgrade-playbook.md`: Batch upgrading, changelog evaluation, and lockfile verification strategies.
- `references/context-contract.md`: Schema for project context.
- `references/output-contract.md`: Standard handoff output structure.
- `references/approval-levels.md`: Risk levels and escalation rules.
- `references/untrusted-content.md`: Untrusted content and anti-tamper safety rules.
