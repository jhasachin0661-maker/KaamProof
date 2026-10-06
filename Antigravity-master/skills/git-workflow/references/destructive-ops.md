# Destructive Git Operations & Approval Classification

## Destructive Operations
The following git commands destroy uncommitted changes, rewrite commit history, or delete remote refs:
- `git push --force` / `git push --force-with-lease`
- `git reset --hard`
- `git clean -fd` / `git clean -fx`
- `git rebase` (on shared branches)
- `git branch -D` / `git push origin --delete`
- History filter / `git-filter-repo`

## Approval Requirements
- **Feature Branches**: `HIGH` risk approval required. Must present exact action, affected commits, and rollback safety plan.
- **Protected / Main Branches**: `CRITICAL` risk approval required. Strictly forbidden to execute autonomously.
