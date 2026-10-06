# Merge Conflict Resolution Procedure

## Resolution Steps
1. Identify conflicting files via `git status`.
2. Inspect conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`) in each file.
3. Understand intent of incoming changes vs current branch changes.
4. Edit files to keep valid logic from both branches while resolving syntax conflicts.
5. Remove all conflict markers.
6. Run build and tests to verify resolution correctness: verify exit code 0.
7. Stage resolved files (`git add <file>`) and finalize merge or rebase (`git commit` or `git rebase --continue`).
