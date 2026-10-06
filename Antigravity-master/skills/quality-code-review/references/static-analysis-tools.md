# Static Analysis Tools Guide

## Supported Tooling
- **Linters**: ESLint, Biome, Flake8, Ruff, Pylint, Clippy.
- **Type Checkers**: `tsc` (TypeScript), `mypy` / `pyright` (Python).
- **Complexity & Duplication**: `complexity-report`, `jscpd` (duplicate code detection), Radon.
- **Dead Code Detectors**: `ts-prune`, `knip`, `vulture`.

## Execution Policy
Run available static analysis commands from project context. Record command status and incorporate tool output lines into ranked review findings.
