# Python Package Management (pip, uv, poetry)

## Commands by Tool

### pip & pip-tools
- Audit vulnerabilities: `pip-audit`
- Outdated check: `pip list --outdated`
- Compile lockfile: `pip-compile requirements.in`

### uv
- Audit vulnerabilities: `uv pip audit` or `pip-audit`
- Sync lockfile: `uv pip sync`
- Lock update: `uv lock`

### poetry
- Outdated check: `poetry show --outdated`
- Lockfile sync: `poetry check`
- Export requirements: `poetry export -f requirements.txt`

## Best Practices
- Always pin exact versions or hash-pinned ranges in production lockfiles.
- Check for Python version compatibility before major package upgrades.
