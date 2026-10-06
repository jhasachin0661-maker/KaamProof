---
name: release-management
description: Manage Semantic Versioning (SemVer), changelog generation, release notes authoring, git release tags, package publishing, and rollback procedures. Trigger whenever drafting release notes, tagging software versions, publishing npm/PyPI packages, or planning rollbacks, even if release management is not named.
metadata:
  category: release
  priority: P1
  layer: deliver
  version: 0.1.0
  reads_from: git-workflow, docs-engineering, quality-release-gate
  risk_max: CRITICAL
---

# Release Management

## Purpose
Govern software release cycles through precise Semantic Versioning (SemVer `MAJOR.MINOR.PATCH`), automated changelog compilation, git tag creation, release notes publishing, package publishing (npm, PyPI, Cargo, Docker), and actionable emergency rollback procedures. Publishing a release or package is classified as a `CRITICAL` risk operation requiring explicit human approval.

## When NOT to use
- Do not use for general feature implementation or code refactoring (use `core-implementation` or `core-refactoring`).
- Do not use for daily git branch commits and PR rebases (use `git-workflow`).

## Inputs
- Git commit history, `package.json` / `pyproject.toml` version declarations, `CHANGELOG.md`, `.agent/context/project-context.json`.

## Procedure
1. **SemVer Evaluation**:
   - Inspect commits since last release tag using conventional commit history (`feat:`, `fix:`, `BREAKING CHANGE:`). Refer to `references/semver.md`.
   - Calculate next version (`MAJOR.MINOR.PATCH`).
2. **Changelog & Release Notes Generation**:
   - Compile structured `CHANGELOG.md` delta categorized into Features, Bug Fixes, Security, Breaking Changes, and Dependency Updates. Refer to `references/changelog.md`.
3. **Release Gate Verification**:
   - Verify `quality-release-gate` status is `VERIFIED`. Confirm test suites pass and security scans show 0 blocking vulnerabilities. Consult `references/release-checklist.md`.
4. **Git Tagging**:
   - Create signed or annotated git release tag (`git tag -a v1.2.0 -m "Release v1.2.0"`).
5. **Package Publishing (`CRITICAL` Risk)**:
   - Prepare package publishing (e.g. `npm publish`, `twine upload`, `cargo publish`).
   - Before executing publish command, pause and present exact action details, target registry, blast radius, rollback plan, and dry-run output to human user for explicit approval (`CRITICAL` level).
6. **Rollback Plan Formulation**:
   - Prepare emergency rollback strategy (git tag revert, package deprecation, blue/green traffic switch) per `references/rollback.md`.

## Validation
- SemVer version calculation strictly backed by commit diff log.
- `CHANGELOG.md` updated matching release notes template.
- Explicit human approval recorded before package publish or tag deployment.

## Failure handling
- If release publish fails or post-release verification fails, execute rollback procedure (`git tag -d vX.Y.Z`, deprecate package release), notify team, and document post-mortem.

## Approval touchpoints
- Refer to `references/approval-levels.md`.
- `MEDIUM`: Drafting changelogs and pre-release candidate tags locally.
- `CRITICAL`: Publishing packages to external registries (npm, PyPI), pushing production release tags, or executing release rollbacks. Requires explicit per-action approval.

## Output
- Handoff file in `.agent/context/handoffs/NN-release-management.md` per `references/output-contract.md`.
- Updated `CHANGELOG.md`, version bump commit, and published release tag.

## References index
- `references/semver.md`: Semantic Versioning specification rules and conventional commit calculation.
- `references/changelog.md`: Changelog format and automated release notes generation.
- `references/release-checklist.md`: Pre-release quality gate verification checklist.
- `references/rollback.md`: Emergency rollback procedures, package deprecation, and tag reverts.
- `references/context-contract.md`: Schema for project context.
- `references/output-contract.md`: Standard handoff output structure.
- `references/approval-levels.md`: Operational risk levels.
- `references/untrusted-content.md`: Untrusted content handling rules.
