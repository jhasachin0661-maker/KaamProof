# JavaScript Error Guide

## Symptoms & Error Codes
- `TypeError: Cannot read properties of undefined (reading 'xyz')`
- `ReferenceError: xyz is not defined`
- `TypeError: xyz is not a function`

## Usual Causes
1. Accessing properties on uninitialized or null variables.
2. Circular module imports or incorrect export syntax (named vs default).
3. Asynchronous state updates where data is accessed before promise resolves.

## Diagnostic Commands
- Run linter / test: `npm test` or `node --trace-warnings path/to/file.js`

## Safe Fixes
- Add optional chaining (`user?.profile?.name`) or nullish coalescing (`val ?? fallback`).
- Verify export signature matches import (`import { foo }` vs `import foo`).
