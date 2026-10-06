---
name: quality-code-review
description: Perform code reviews on diffs, pull requests, and codebase changes. Trigger whenever reviewing code, checking pull requests, evaluating code quality, maintainability, or refactoring safety, even if code-review is not explicitly named. Ranks findings with evidence, runs static analysis, and applies design principles with judgment.
metadata:
  category: quality
  priority: P1
  layer: verify
  version: 0.1.0
  reads_from: core-repo-discovery
  risk_max: LOW
---

# Quality Code Review

## Purpose
Perform thorough, objective code reviews on pull requests, diffs, and source code changes. Classify findings into ranked severity buckets (blocking, should-fix, nit) backed by file:line evidence. Evaluate code against static analysis results and apply engineering design principles with pragmatic judgment.

## When NOT to use
- Do not use as a substitute for automated testing or build execution (use `testing-engineering` or `quality-release-gate`).
- Do not apply automated refactoring edits unless explicitly instructed to perform remediation.

## Inputs
- Staged git diff, modified source files, static linter/typecheck reports, and `.agent/context/project-context.json`.

## Procedure
1. **Scope & Tooling Assessment**: Inspect modified file diffs. Run available static analysis tools (linters, type checkers, complexity scanners, dead-code detectors, duplicate-code checkers). Refer to `references/static-analysis-tools.md`.
2. **Review Checklist Audit**: Audit diffs against clean code criteria (correctness, performance, error handling, maintainability, naming clarity). Refer to `references/review-checklist.md` and `references/naming-maintainability.md`.
3. **Pragmatic Principles Evaluation**: Evaluate design principles (SOLID, DRY, KISS, YAGNI) strictly with pragmatic judgment. Cite a principle ONLY when applying it directly improves the outcome. Never enforce abstract principles if doing so over-engineers or worsens the architecture. Refer to `references/principles-with-judgment.md`.
4. **Findings Classification**: Rank each review finding into one of three categories:
   - **BLOCKING**: Severe logic bugs, security vulnerabilities, breaking contract changes, or build/type failures.
   - **SHOULD-FIX**: Code smells, missing error bounds, suboptimal complexity, missing tests, poor naming.
   - **NIT**: Optional style preferences, minor formatting suggestions, non-critical polish.
5. **Evidence Citation**: Provide precise `file:line` references, rationale for why the finding matters, and a concrete proposed resolution for every finding.
6. **Read-Only Protocol**: Maintain read-only analysis status by default unless the user explicitly requests code remediation.

## Validation
- Every reported finding includes exact `file:line` location evidence.
- Principles (SOLID/DRY/KISS/YAGNI) are cited only with pragmatic architecture justification.
- Findings are structured strictly into BLOCKING, SHOULD-FIX, and NIT categories.

## Failure handling
- If static analysis tools fail to execute, proceed with manual code inspection and record missing static analysis evidence in handoff.

## Approval touchpoints
- Refer to `references/approval-levels.md`.
- `LOW`: Code review, static analysis execution, and report generation. Fully autonomous.

## Output
- Handoff file in `.agent/context/handoffs/NN-quality-code-review.md` per `references/output-contract.md`.
- Ranked code review report with line citations and fix recommendations.

## References index
- `references/review-checklist.md`: Core code review checklist and verification steps.
- `references/principles-with-judgment.md`: Applying SOLID, DRY, KISS, YAGNI with pragmatic judgment.
- `references/static-analysis-tools.md`: Running linters, typecheckers, complexity, and duplicate-code tools.
- `references/naming-maintainability.md`: Naming conventions, function scope, and code maintainability guidelines.
- `references/context-contract.md`: Schema for project context.
- `references/output-contract.md`: Standard handoff output structure.
- `references/approval-levels.md`: Operational risk levels.
- `references/untrusted-content.md`: Untrusted content handling rules.
