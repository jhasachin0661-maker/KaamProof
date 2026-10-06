---
name: core-implementation
description: Execute software implementation, feature development, code refactoring, or project scaffolding. Trigger whenever asked to write code, add a feature, modify functions, scaffold a project, or implement components, even if implementation is not named.
metadata:
  category: core
  priority: P0
  layer: build
  version: 0.1.0
  reads_from: core-repo-discovery, core-requirements-planning, config-env-secrets
  risk_max: MEDIUM
---

# Core Implementation

## Purpose
Safely implement code changes, build new features, or scaffold greenfield applications while matching existing codebase conventions, preserving working behavior, and validating builds empirically.

## When NOT to use
- Do not use for high-level requirement planning without writing code, or for standalone diagnostic debugging of failing tests.

## Inputs
- Workspace source code, `.agent/context/project-context.json`, and `requirements.md`.

## Procedure
1. **Context & Convention Inspection**: Read `.agent/context/project-context.json`. Inspect existing source files using `references/conventions-matching.md` to identify styling, naming, indentation, error handling, and export patterns.
2. **Minimal Safe Change**: Design the smallest necessary diff. Preserve working behavior. Never rewrite existing code from scratch unless explicitly requested.
3. **API & Package Grounding**: Never invent package exports, function signatures, or configuration keys. Validate version-sensitive APIs against installed packages or `core-research` findings.
4. **Git Checkpoint**: Before executing multi-file edits, create a local git commit or stash checkpoint (Risk level `MEDIUM`).
5. **Implementation**:
   - **Existing Codebase**: Edit files adhering strictly to detected conventions per `references/change-checklist.md`.
   - **Greenfield**: Scaffold using official CLI generators per `references/greenfield-scaffold.md`.
6. **New Dependency Policy**: Adding or upgrading package dependencies is `MEDIUM` risk. Include written justification in handoff.
7. **Empirical Command Validation**: Run verified build, lint, and typecheck commands from `.agent/context/project-context.json`. Verify exit code 0.

## Validation
- Build validation: run build command (exit code 0).
- Typecheck & Lint validation: run typecheck and linter (exit code 0).
- Evidence citation: list modified files and command exit codes in handoff.

## Failure handling
- If build or lint fails after code modifications, capture error output and route to `core-debugging`. Max 2 remediation cycles before restoring checkpoint.

## Approval touchpoints
- Refer to `references/approval-levels.md`.
- `LOW`: Single-file code modifications and local builds.
- `MEDIUM`: Multi-file refactoring, adding new dependencies, creating git checkpoints.

## Output
- Handoff file in `.agent/context/handoffs/NN-core-implementation.md` per `references/output-contract.md` listing `FILES_CHANGED` and exit codes.

## References index
- `references/greenfield-scaffold.md`: Official CLI scaffolding generators and rules.
- `references/change-checklist.md`: Implementation verification checklist.
- `references/conventions-matching.md`: Style, naming, and architecture conventions matching rules.
- `references/context-contract.md`: Schema for project context.
- `references/output-contract.md`: Standard handoff output structure.
- `references/approval-levels.md`: Risk levels and escalation rules.
- `references/untrusted-content.md`: Untrusted content and anti-tamper safety rules.
