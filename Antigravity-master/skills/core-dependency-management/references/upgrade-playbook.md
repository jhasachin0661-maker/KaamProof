# Dependency Upgrade Playbook

## Strategy
1. **Audit First**: Run security scan to identify high/critical vulnerabilities.
2. **Patch & Minor Updates**: Upgrade patch and minor versions in batches of 3-5 packages. Run tests after each batch.
3. **Major Version Upgrades**:
   - Upgrade one major package at a time.
   - Read release notes / changelogs for breaking changes.
   - Update code call sites to handle API changes before committing lockfile update.
4. **Lockfile Verification**: Ensure lockfiles are consistent with manifests.
5. **License Verification**: Reject non-compliant licenses (GPL/AGPL in proprietary projects).
6. **Feature-Flag Cleanup**: Remove retired flags and legacy compatibility shims associated with upgraded dependencies.
