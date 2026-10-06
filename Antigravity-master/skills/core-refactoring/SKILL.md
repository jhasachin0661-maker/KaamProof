---
name: core-refactoring
description: Behavior-preserving code restructuring for any codebase. Trigger whenever improving code structure, reducing complexity, removing duplication, renaming, splitting functions, or cleaning up legacy code, even if refactoring is not explicitly named. Writes characterization tests first and changes in small reversible steps.
metadata:
  category: core
  priority: P1
  layer: build
  version: 0.1.0
  reads_from: core-repo-discovery, testing-engineering
  risk_max: MEDIUM
---

# Core Refactoring

## Purpose
Safely restructure existing code to improve clarity, reduce complexity, and remove duplication while strictly preserving observable behavior. Characterization tests are written before any edits begin; every step is reversible and validated.

## When NOT to use
- Do not mix behavior changes with structural refactoring in the same step or commit.
- Do not use for writing net-new features or functionality (use `core-implementation`).

## Inputs
- Source files to refactor, existing test suite results, and `.agent/context/project-context.json`.

## Procedure
1. **Version Check**: Read framework/library versions from `package.json` or `pyproject.toml`. Verify any version-sensitive APIs or patterns before refactoring.
2. **Characterization Test First**: Before touching any code, write characterization tests that pin current observable behavior (inputs, outputs, side effects). These tests must pass on the original code. Refer to `references/characterization-tests.md`.
3. **Git Checkpoint**: Create a local git commit or stash to mark the safe starting state (`MEDIUM` risk).
4. **Small Reversible Steps**: Apply one refactor pattern at a time (extract function, rename, inline, move, decompose). Never apply multiple patterns in a single diff. Refer to `references/refactor-patterns.md`.
5. **Test After Each Step**: Run the full test suite after every individual change. If tests fail, immediately revert that single step and diagnose before continuing.
6. **No Behavior Change Rule**: If any refactoring step requires changing behavior to proceed, stop, document the behavioral gap separately, and route it as a new implementation task.

## Validation
- Characterization tests written and passing on original code before first edit.
- Tests pass after every individual refactoring step (exit code 0).
- Git diff shows zero observable behavior changes.

## Failure handling
- If tests fail after a step, revert that step (`git checkout -- <file>`), capture the failure log, and route to `core-debugging` before resuming.

## Approval touchpoints
- Refer to `references/approval-levels.md`.
- `MEDIUM`: Multi-file refactors with git checkpoint creation. Logged justification required.

## Output
- Handoff file in `.agent/context/handoffs/NN-core-refactoring.md` per `references/output-contract.md`.
- List of refactoring steps applied, test results per step, and files changed.

## References index
- `references/refactor-patterns.md`: Catalog of safe refactoring patterns and sequencing rules.
- `references/characterization-tests.md`: Writing characterization tests to pin existing behavior.
- `references/context-contract.md`: Schema for project context.
- `references/output-contract.md`: Standard handoff output structure.
- `references/approval-levels.md`: Operational risk levels.
- `references/untrusted-content.md`: Untrusted content handling rules.
