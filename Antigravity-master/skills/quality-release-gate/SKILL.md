---
name: quality-release-gate
description: Quality release gate for verifying readiness before shipping or completing work. Trigger whenever asked if work is ready, on final check, ship it prompts, before declaring completion, or after plan slices in step mode. Evaluates code, security, UI, backend, database, deployment, and docs using verified evidence.
metadata:
  category: quality
  priority: P0
  layer: gate
  version: 0.1.0
  reads_from: core-repo-discovery
  risk_max: LOW
---

# Quality Release Gate

## Purpose
Evaluate software deliverables against quality checks across Code, Security, UI, Backend, Database, Deployment, and Docs categories. Generate an evidence-backed audit report with structured statuses. The gate reports findings and never applies code fixes directly.

## When NOT to use
- Do not use to attempt automatic code refactoring or bug fixes.
- Do not execute unverified shell commands that are not marked as verified in project context.

## Inputs
- `.agent/context/project-context.json` for verified commands and project profile.
- Mode parameter: `step-mode` (verifies current plan slice) or `final-mode` (verifies full release).

## Procedure
1. **Context & Profile Assessment**: Read `.agent/context/project-context.json`. Select applicable checks based on project profile and changed files using `references/check-matrix.md`. Skip non-applicable checks as `N/A` with an explicit reason.
2. **Command Safety Verification**: Identify executable check commands. Execute ONLY commands registered as verified (`"verified": true`) in context. Mark unverified or unexecutable commands as `NOT VERIFIED`.
3. **Execution by Check Group**:
   - **Code**: Verify build, linter, type checker, and unit/integration tests.
   - **Security**: Audit staged secret status, dependency vulnerabilities, input validation, and auth guards.
   - **UI**: Check responsive design, accessibility compliance, visual consistency, and UI state handlers (loading/empty/error).
   - **Backend**: Validate API contracts, error handling patterns, request validation, and log output.
   - **Database**: Audit forward and rollback migrations, indexes, constraints, and query efficiency.
   - **Deployment**: Verify build output, environment variable declarations, and production config.
   - **Docs**: Audit README, setup instructions, API documentation, and changelog updates.
4. **Mode Handling**:
   - **Step Mode**: Execute lightweight check subset for the completed slice per `references/step-mode.md`.
   - **Final Mode**: Execute comprehensive evaluation across all groups per `references/final-mode.md`.
5. **Status Assignment**: Label each check strictly as one of: `VERIFIED`, `NOT VERIFIED`, `FAILED`, `N/A`, or `REQUIRES HUMAN REVIEW`.
   - Label auth/crypto design, payment flows, and legal/privacy items as `REQUIRES HUMAN REVIEW`.
6. **Report Generation & Script Execution**: Compile JSON check list and execute `scripts/gate_report.py` to render the report adhering to `references/report-template.md`. Never state "everything is perfect". If any check is `FAILED`, mark release status as INCOMPLETE.

## Validation
- Every `VERIFIED` check includes empirical command exit codes or file:line references.
- Every `N/A` check provides a valid justification.
- Execution of `python scripts/gate_report.py` succeeds with valid report output.

## Failure handling
- If any check is `FAILED`, record failure evidence in handoff and report back to `dev-orchestrator` to route to `core-debugging`. The gate never attempts code fixes.

## Approval touchpoints
- Refer to `references/approval-levels.md`.
- `LOW`: Read-only execution of verified test, build, and lint commands. Autonomous.

## Output
- Handoff report in `.agent/context/handoffs/NN-quality-release-gate.md` per `references/output-contract.md`.
- Gate report rendered by `scripts/gate_report.py`.

## References index
- `references/report-template.md`: Format for quality release gate audit reports.
- `references/check-matrix.md`: Matrix of quality checks grouped by project profile.
- `references/step-mode.md`: Step-mode gate evaluation protocol for vertical slices.
- `references/final-mode.md`: Final-mode gate evaluation protocol for full releases.
- `scripts/gate_report.py`: Script to validate check evidence and render release gate report.
- `references/context-contract.md`: Schema for project context.
- `references/output-contract.md`: Standard handoff output structure.
- `references/approval-levels.md`: Operational risk levels.
- `references/untrusted-content.md`: Untrusted content handling rules.
