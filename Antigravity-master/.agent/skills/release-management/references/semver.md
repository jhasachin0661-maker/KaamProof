# Semantic Versioning (SemVer 2.0.0)

Format: `MAJOR.MINOR.PATCH`

1. **MAJOR**: Increment when introducing incompatible API changes or breaking changes (`BREAKING CHANGE:` commit header or footer).
2. **MINOR**: Increment when adding functionality in a backward-compatible manner (`feat:` commits).
3. **PATCH**: Increment when making backward-compatible bug fixes (`fix:` or `refactor:` commits).

## Pre-release & Build Metadata
- Pre-release: `v1.2.0-rc.1`, `v2.0.0-beta.2`
- Build metadata: `v1.2.0+20261003`

## Conventional Commit Mapping

| Commit Prefix | SemVer Bump | Example |
|---|---|---|
| `BREAKING CHANGE:` | MAJOR | `feat!: remove legacy v1 auth API` |
| `feat:` | MINOR | `feat(user): add OAuth login support` |
| `fix:` | PATCH | `fix(db): fix connection pool leak` |
| `docs:` / `chore:` | PATCH (optional) | `docs: update setup guide` |
