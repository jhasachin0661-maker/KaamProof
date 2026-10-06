# Emergency Release Rollback Protocol

## 1. Git Tag & Commit Rollback
```bash
# Revert release tag locally and remotely
git tag -d v1.2.0
git push origin :refs/tags/v1.2.0

# Revert release version bump commit
git revert HEAD -m 1
git push origin main
```

## 2. Package Deprecation (npm / PyPI)
If bad package was already published:

```bash
# npm package deprecation
npm deprecate my-package@1.2.0 "Critical bug in v1.2.0, please revert to v1.1.9"

# PyPI package yank
yank-cli --package my-package --version 1.2.0
```

## 3. Production Deployment Traffic Switch
- Switch load balancer / CDN target to previous stable release tag (`v1.1.9`).
- Execute database rollback migration if schema migrations were applied (`database-migrations-orm`).
