# Pre-Release Checklist

## Quality & Test Gates
- [ ] Full automated test suite passes (exit code 0).
- [ ] Build & compilation clean with zero errors.
- [ ] Security scans (SAST, SCA, secrets) clean with zero unresolved Critical/High vulnerabilities.

## Documentation & Versioning
- [ ] Version number bumped in manifest files (`package.json`, `pyproject.toml`, `Cargo.toml`).
- [ ] `CHANGELOG.md` updated with release diff.
- [ ] Documentation updated to reflect API changes.

## Approval & Risk Gate
- [ ] Risk level evaluated as `CRITICAL` for package registry publishing.
- [ ] Explicit human user approval requested and granted.
- [ ] Emergency rollback plan documented and ready.
