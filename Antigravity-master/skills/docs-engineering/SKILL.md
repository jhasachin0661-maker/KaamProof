---
name: docs-engineering
description: Create, update, and verify software documentation including READMEs, setup guides, architecture docs, API specifications, ADRs, contribution guides, and troubleshooting manuals. Trigger whenever updating docs from code diffs, authoring API docs, writing setup guides, or verifying run commands, even if docs engineering is not named.
metadata:
  category: docs
  priority: P1
  layer: document
  version: 0.1.0
  reads_from: core-repo-discovery
  risk_max: LOW
---

# Docs Engineering

## Purpose
Produce precise, clear, and executable technical documentation for software repositories (README, setup guides, architecture docs, API references, contribution rules, ADRs, onboarding manuals, troubleshooting guides). Ensure documentation stays strictly synchronized with code diffs and that every documented command is empirically verified.

## When NOT to use
- Do not use for writing marketing copy or non-technical product announcements.
- Do not use for making underlying code or architectural changes (use `core-implementation` or `arch-system-design`).

## Inputs
- Repository code diffs, `.agent/context/project-context.json`, existing docs in `docs/`, `README.md`.

## Procedure
1. **Context & Diff Analysis**:
   - Inspect recent git diffs and context files to identify modified CLI commands, environment variables, APIs, or architectural structures.
2. **Document Type Selection**:
   - Select appropriate template and documentation structure:
     - Project Overview & Setup: `README.md` using `references/readme-template.md`.
     - Architecture Decisions: `docs/adr/` using `references/adr-template.md`.
     - API Contracts & Endpoints: `docs/api/` using `references/api-docs.md`.
     - Common Errors & Fixes: `docs/troubleshooting.md` using `references/troubleshooting-template.md`.
3. **Diff Synchronization**:
   - Synchronize documentation directly from verified code behavior. Update environment variable tables, API parameters, and configuration keys.
4. **Command Execution Verification**:
   - Test every shell script and command documented in setup or README guides. Verify commands run cleanly with exit code 0.
5. **Formatting & Structure**:
   - Use clean Markdown syntax, GitHub-flavored alerts (`> [!NOTE]`, `> [!IMPORTANT]`), and clear code block annotations.

## Validation
- Documented setup and test commands tested and verified (exit code 0).
- Docs updated to match exact code diff behavior with 0 drift.
- All markdown links and relative file paths validated.

## Failure handling
- If a documented command fails during verification, capture error, fix the documented flags/arguments, re-test until exit code 0, and update the troubleshooting guide.

## Approval touchpoints
- Refer to `references/approval-levels.md`.
- `LOW`: Reading code, creating/updating markdown documentation files, running verification commands.

## Output
- Handoff file in `.agent/context/handoffs/NN-docs-engineering.md` per `references/output-contract.md`.
- Updated or newly authored documentation files (`README.md`, `docs/*.md`).

## References index
- `references/readme-template.md`: Standard README template with quickstart and environment sections.
- `references/adr-template.md`: Architecture Decision Record template.
- `references/api-docs.md`: OpenAPI and REST API documentation structure guidelines.
- `references/troubleshooting-template.md`: Format for troubleshooting guides and common resolution steps.
- `references/context-contract.md`: Schema for project context.
- `references/output-contract.md`: Standard handoff output structure.
- `references/approval-levels.md`: Risk levels and escalation rules.
- `references/untrusted-content.md`: Untrusted content and anti-tamper safety rules.
