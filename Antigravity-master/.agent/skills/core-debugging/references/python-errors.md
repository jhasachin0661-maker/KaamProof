# Python Error Guide

## Symptoms & Error Codes
- `AttributeError: 'NoneType' object has no attribute 'xyz'`
- `KeyError: 'xyz'`
- `ModuleNotFoundError: No module named 'xyz'`
- `TypeError: unsupported operand type(s)`

## Usual Causes
1. Accessing dictionary keys without `.get()` fallback.
2. Missing dependencies in virtual environment.
3. Circular imports or relative import syntax errors (`from . import foo`).

## Diagnostic Commands
- Run pytest: `pytest -v` or `python -m mypy src/`

## Safe Fixes
- Use `.get('key', default)` for dictionary access.
- Add explicit type annotations and non-null checks (`if obj is not None:`).
- Install missing package in virtual environment (`pip install pkg`).
