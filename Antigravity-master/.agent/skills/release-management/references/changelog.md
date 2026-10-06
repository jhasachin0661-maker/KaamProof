# Keep a Changelog Format

## Structure Template

```markdown
# Changelog

All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [1.2.0] - 2026-10-03

### Added
- Added OAuth2 user authentication integration (#142).
- Added multi-tenant permission isolation checks (#145).

### Fixed
- Fixed memory leak in database connection pool connection check (#138).

### Security
- Upgraded vulnerable third-party JWT library to v9.0.2 (#150).

### Breaking Changes
- Deprecated legacy basic authentication header format.
```
