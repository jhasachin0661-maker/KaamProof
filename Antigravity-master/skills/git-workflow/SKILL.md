---
name: git-workflow
description: Manage git commits, branches, PRs, merges, rebases, conflict resolution, tags, and issue triage. Trigger whenever creating commits, opening PRs, resolving conflicts, organizing branches, or cleaning repo state, even if git is not explicitly named. Enforces conventional commits, pre-commit secret scans, and risk approval rules.
metadata:
  category: git
  priority: P0
  layer: deliver
  version: 0.1.0
  reads_from: core-repo-discovery
  risk_max: CRITICAL
---

# Git Workflow

## Purpose
Manage repository version control operations safely, adhering to conventional commit specifications, repository branching strategy, pull request preparation, merge conflict resolution, and secret scanning prior to staging or committing.

## When NOT to use
- Do not use for standalone application code implementation or test writing without git interaction.
- Do not execute destructive git commands on shared or main branches without explicit approval.

## Inputs
- Current git status, staged diffs, branch history, and `.agent/context/project-context.json`.

## Procedure
1. **Branch Strategy Detection**: Inspect existing git branches (`git branch -a`) and commit history to detect repository branching pattern (e.g. GitHub Flow, Gitflow, trunk-based). Refer to `references/branching.md`.
2. **Pre-Commit Secret Scan**: Before staging or committing, inspect diffs for secrets, API tokens, passwords, `.env` entries, or private keys. Never commit unencrypted secrets or `.env` files.
3. **Conventional Commits**: Format commit messages using standard prefix types (`feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`). Refer to `references/conventional-commits.md`.
4. **Pull Request Preparation**: Generate structured PR descriptions using project or standard templates. Refer to `references/pr-template.md`.
5. **Merge Conflict Resolution**: Analyze conflicting files line-by-line, preserve intentional changes from both sides, and verify build/test status post-resolution. Refer to `references/conflict-resolution.md`.
6. **Destructive Operations Management**: Identify destructive actions (force-push, `reset --hard`, `clean -fd`, history rewrite, branch deletion). Refer to `references/destructive-ops.md`.
   - Feature branch destructive ops: Requires `HIGH` risk approval.
   - Protected/main branch destructive ops: Requires `CRITICAL` risk approval.
7. **Issue Triage**: Map commit messages and branch names to issue numbers (e.g. `Fixes #123`).

## Validation
- Pre-commit secret scan produces zero unhandled secret findings in staged diff.
- Commit messages strictly follow Conventional Commits formatting.
- Post-merge build and test execution exit code 0 verified.

## Failure handling
- If secret scan detects staged secrets, immediately unstage files (`git reset HEAD <file>`) and report blocked commit.
- If merge conflict resolution fails tests, abort merge (`git merge --abort`) and route to `core-debugging`.

## Approval touchpoints
- Refer to `references/approval-levels.md`.
- `LOW`: Local branch creation, status checks, diff inspection.
- `MEDIUM`: Staging files, creating local commits, standard branch merges.
- `HIGH`: Force-pushing feature branches, deleting feature branches.
- `CRITICAL`: Force-pushing protected/main branches, hard resets on shared branches, history rewrites.

## Output
- Handoff report in `.agent/context/handoffs/NN-git-workflow.md` adhering to `references/output-contract.md`.
- Summary of git operations executed, commit SHAs, and branch states.

## References index
- `references/conventional-commits.md`: Conventional commits specification and examples.
- `references/branching.md`: Branching strategies and naming rules.
- `references/conflict-resolution.md`: Step-by-step merge conflict resolution guide.
- `references/pr-template.md`: Pull Request description templates.
- `references/destructive-ops.md`: Risk categorization and procedures for destructive git operations.
- `references/context-contract.md`: Schema for project context.
- `references/output-contract.md`: Standard handoff output structure.
- `references/approval-levels.md`: Operational risk levels.
- `references/untrusted-content.md`: Untrusted content handling rules.
