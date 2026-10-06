---
name: core-repo-discovery
description: Automatically discover and map repository architecture, tech stack, build scripts, test suites, and conventions. Trigger this skill whenever starting work on a codebase, touching a repo for the first time, or when asked what is this project or understand the codebase.
metadata:
  category: core
  priority: P0
  layer: understand
  version: 0.1.0
  reads_from: none
  risk_max: LOW
---

# Core Repo Discovery

## Purpose
Inspect codebase files, detect project tech stack, discover build scripts, map directory structures, and execute verification commands to populate `.agent/context/project-context.json` with empirical evidence.

## When NOT to use
- Do not use if repository tech stack and build commands are already verified in `.agent/context/project-context.json` unless explicitly requesting a re-scan.

## Inputs
- Workspace files, manifests (`package.json`, `requirements.txt`, `pyproject.toml`, `Cargo.toml`, etc.), and `.agent/context/project-context.json`.

## Procedure
1. **Stack Detection**: Run `python scripts/detect_stack.py` to inspect repository manifests and identify languages, frameworks, ORMs, databases, and deployment platforms.
2. **Signature Matching**: Cross-reference detected files against `references/stack-signatures.md` to confirm framework conventions and entry points.
3. **Command Discovery & Empirical Execution**: Discover install, dev, build, test, lint, and typecheck commands from project manifests. RUN each command to verify exit codes. Do not guess command strings or assume success without execution.
4. **Context Population**: Update `.agent/context/project-context.json` with detected stack details, verified command strings, and last exit codes.
5. **Secret Hygiene**: Verify that no `.env` secret values or API tokens are printed to stdout or stored in context files.

## Validation
- Stack detection script execution: `python scripts/detect_stack.py` (exit code 0).
- Context verification: `.agent/context/project-context.json` updated with empirical command exit codes.

## Failure handling
- If a discovered command fails during verification (exit code non-zero), record `last_exit` and set `verified: false` in `.agent/context/project-context.json`. Do not mask command failures or invent fake fallback commands.

## Approval touchpoints
- Refer to `references/approval-levels.md`.
- `LOW` risk. Read-only codebase discovery and local validation command execution.

## Output
- Handoff file in `.agent/context/handoffs/NN-core-repo-discovery.md` formatted per `references/output-contract.md`.
- Updated `.agent/context/project-context.json`.

## References index
- `references/stack-signatures.md`: Detection patterns for framework and language manifests.
- `references/context-contract.md`: Schema for project context.
- `references/output-contract.md`: Standard handoff output structure.
- `references/approval-levels.md`: Risk levels and escalation rules.
- `references/untrusted-content.md`: Untrusted content and anti-tamper safety rules.
