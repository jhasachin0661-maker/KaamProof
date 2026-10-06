# Branching Strategies & Naming Conventions

## Branch Naming Pattern
- `feature/<short-description>`: New features.
- `bugfix/<short-description>` or `fix/<short-description>`: Bug fixes.
- `hotfix/<short-description>`: Critical production fixes.
- `chore/<short-description>`: Maintenance and tool upgrades.
- `release/<version>`: Release candidate branches.

## Strategy Detection
1. Check existing remote branches (`git branch -r`).
2. **Trunk-Based**: Small feature branches merging directly into `main` / `master`.
3. **GitHub Flow**: Feature branches merged into `main` via PRs.
4. **Gitflow**: Feature branches merged into `develop`, released via `release/*` into `main`.
