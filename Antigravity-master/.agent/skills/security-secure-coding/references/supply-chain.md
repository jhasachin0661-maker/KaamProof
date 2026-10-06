# Supply Chain Security & Dependency Inspection

## Dependency Security Best Practices
- Run audit commands (`npm audit`, `pip-audit`, `cargo audit`) to detect known CVEs in third-party packages.
- Pin dependency versions using package lockfiles (`package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`, `Pipfile.lock`, `Cargo.lock`).
- Verify package provenance and integrity checksums.
- Avoid typosquatting by cross-checking package names against official package repositories.
