---
name: testing-engineering
description: Derive, write, and execute automated tests for code changes including unit, integration, API, regression, and smoke tests. Trigger after any behavior change, when asked to write tests, add coverage, test this, or prevent regressions, even if testing is not named.
metadata:
  category: testing
  priority: P0
  layer: verify
  version: 0.1.0
  reads_from: core-repo-discovery
  risk_max: LOW
---

# Testing Engineering

## Purpose
Derive the required test types from modified files, write tests using the existing repository test framework and conventions, execute test suites, and report empirical pass/fail exit codes and coverage deltas.

## When NOT to use
- Do not use for debugging failing production systems or performing security scanning. Use `core-debugging` or `security-scanning` instead.

## Inputs
- `FILES_CHANGED` from implementation handoff, `.agent/context/project-context.json`, existing test files and configuration.

## Procedure
1. **Framework Discovery**: Read `.agent/context/project-context.json` to identify the repo's test framework (Jest, Vitest, Pytest, etc.) and runner conventions. Never impose a different test framework.
2. **Test Type Derivation**: Use the Test Selection Matrix in `references/test-selection-matrix.md` to determine which test types are required based on `FILES_CHANGED`:
   - **Unit tests**: For pure functions, utility modules, and data transformations.
   - **Integration tests**: For database queries, service interactions, and middleware.
   - **API tests**: For route handlers, REST/GraphQL endpoints, and contract validation.
   - **Regression tests**: For bug fixes (reproducing the original failure).
   - **Smoke tests**: For critical user-facing flows after large changes.
3. **Convention Matching**: Inspect existing test files to match naming conventions (`*.test.ts`, `*.spec.ts`, `test_*.py`), directory placement (`__tests__/`, `tests/`), and assertion styles.
4. **Test Writing**: Consult framework-specific references:
   - JavaScript/TypeScript: `references/jest-vitest.md`, `references/testing-library.md`
   - Python: `references/pytest.md`
   - API endpoints: `references/supertest-api.md`
   - Regression coverage: `references/regression-testing.md`
5. **Execution & Exit Code Recording**: Run the test command from project context and record the exact exit code. If coverage tooling exists, capture coverage delta.
6. **Database & Environment Safety**: Tests must target local or test databases only. Refuse to execute tests pointing at production URLs.
7. **Flaky Test Handling**: If a test fails non-deterministically, rerun it exactly once. If it still fails, mark it `flaky` in the handoff. Never delete or weaken test assertions to make tests pass.

## Validation
- Test command execution: exit code 0 (or specific failures documented).
- Coverage delta: reported when coverage tooling exists (e.g. `--coverage` flag).
- Evidence: every passing/failing test name and exit code cited in handoff.

## Failure handling
- If tests fail after implementation, capture the full test output and route back to `core-debugging` via handoff.
- Never weaken assertions, delete failing tests, or mock away real failures to achieve green status.

## Approval touchpoints
- Refer to `references/approval-levels.md`.
- `LOW` risk. Writing and running local tests.

## Output
- Handoff file in `.agent/context/handoffs/NN-testing-engineering.md` per `references/output-contract.md`.

## References index
- `references/jest-vitest.md`: Jest and Vitest testing patterns for TypeScript/JavaScript.
- `references/pytest.md`: Pytest conventions and fixture patterns for Python.
- `references/supertest-api.md`: Supertest HTTP endpoint testing patterns.
- `references/testing-library.md`: React Testing Library and DOM testing patterns.
- `references/test-selection-matrix.md`: Decision matrix mapping file changes to test types.
- `references/regression-testing.md`: Regression test design for bug fix verification.
- `references/context-contract.md`: Schema for project context.
- `references/output-contract.md`: Standard handoff output structure.
- `references/approval-levels.md`: Risk levels and escalation rules.
- `references/untrusted-content.md`: Untrusted content handling rules.
