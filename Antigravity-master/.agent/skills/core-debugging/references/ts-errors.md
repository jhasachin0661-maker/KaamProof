# TypeScript Error Guide

## Symptoms & Error Codes
- `TS2304: Cannot find name 'xyz'`
- `TS2322: Type 'A' is not assignable to type 'B'`
- `TS2345: Argument of type 'A' is not assignable to parameter of type 'B'`
- `TS2769: No overload matches this call`

## Usual Causes
1. Missing type definitions (`@types/node`, `@types/react`).
2. Mismatched object property types or unhandled `null`/`undefined` union branches.
3. Outdated `tsconfig.json` target or lib compiler options.

## Diagnostic Commands
- Run typecheck: `npx tsc --noEmit`

## Safe Fixes
- Add proper interface fields or explicit type guards (`if (isUser(obj))`).
- Install missing type definitions (`npm install -D @types/pkg`).
- Avoid `any` assertions; use strict type narrowing.
