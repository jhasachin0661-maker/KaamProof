---
name: core-debugging
description: Systematic reactive debugging for build errors, test failures, runtime crashes, and stack traces. Trigger whenever encountering an error message, stack trace, failing build, failing test, broken feature, 500 error, or crash, even if debugging is not explicitly named.
metadata:
  category: core
  priority: P0
  layer: verify
  version: 0.1.0
  reads_from: core-repo-discovery
  risk_max: MEDIUM
---

# Core Debugging

## Purpose
Perform systematic, empirical root-cause analysis and remediation for runtime errors, build failures, broken tests, and unexpected application crashes.

## When NOT to use
- Do not use for initial feature planning or greenfield project scaffolding when no errors exist.

## Inputs
- Full error logs, stack traces, failing command outputs, and workspace source code.

## Procedure: The 11-Step Debugging Loop
1. **Read Logs**: Read un-truncated error logs, exit codes, and stack trace messages.
2. **Reproduce**: Execute the failing command (test, build, or script) to reproduce the exact failure empirically.
3. **Classify & Select Guide**: Match error symptoms against the Error Classification Table below and consult the corresponding error guide in `references/`.
4. **Likely Root Cause**: Formulate a single testable hypothesis based strictly on log evidence.
5. **Trace Dependency Chain**: Trace upstream data flows, function calls, or imported module contracts.
6. **Inspect Relevant Files**: Inspect full file definitions (do not rely on partial 15-line snippets).
7. **Minimal Reproduction**: Isolate the failing test case or module invocation.
8. **Apply Fix**: Implement smallest safe remediation fixing the root cause.
9. **Run Tests**: Re-run the failing test/build command to confirm exit code 0.
10. **Check Regressions**: Run full test suite to verify no secondary regressions were introduced.
11. **Explain & Document**: Explain exact root cause and remediation details in handoff.

## Error Classifier Table

| Symptom / Stack Trace Pattern | Error Class Category | Reference File |
|---|---|---|
| `TypeError`, `ReferenceError`, `undefined is not a function` | JavaScript Runtime Error | `references/js-errors.md` |
| `TS2304`, `TS2322`, `TS2345`, Type mismatch | TypeScript Compiler Error | `references/ts-errors.md` |
| `AttributeError`, `KeyError`, `ImportError`, `IndentationError` | Python Runtime / Syntax Error | `references/python-errors.md` |
| Module not found, Webpack / Vite bundling failure | Build System Error | `references/build-errors.md` |
| `ERR_PNPM_INVALID_PACKAGE_KEY`, lockfile conflict, version mismatch | Dependency Error | `references/dependency-errors.md` |
| `ECONNREFUSED` on 5432/3306, Prisma migration error, SQL syntax error | Database Error | `references/database-errors.md` |
| `404 Not Found`, `500 Internal Server Error`, CORS error, REST/GraphQL | API Error | `references/api-errors.md` |
| `401 Unauthorized`, `403 Forbidden`, Invalid token, JWT expired | Auth Error | `references/auth-errors.md` |
| CI build failure, Vercel/Netlify deploy error, IaC failure | Deployment Error | `references/deployment-errors.md` |
| Container exited with code 137, Docker build error, port conflict | Docker Error | `references/docker-errors.md` |
| `process.env.VAR is undefined`, missing env var | Environment Variable Error | `references/env-var-errors.md` |
| `ETIMEDOUT`, DNS lookup failed, socket hangup | Network Error | `references/network-errors.md` |
| Out of memory, unhandled promise rejection, process crash | General Runtime Error | `references/runtime-errors.md` |

## Validation
- Re-run failing command: command exits with exit code 0.
- Empirical evidence: exact error log, fix diff, and test output cited in handoff.

## Failure handling
- Maximum **2 remediation cycles** per failing check.
- If fix fails after 2 cycles, stop immediately and issue a Blocker Report detailing failing command, raw log, root cause hypothesis, and preserved working tree.
- **Anti-Tamper Rule**: NEVER delete, skip, or weaken a failing test or assertion to make a build pass.

## Approval touchpoints
- Refer to `references/approval-levels.md`.
- `LOW`: Code edits fixing bugs, running local tests.
- `MEDIUM`: Dependency updates required for bug fixes, database schema fixes.

## Output
- Handoff file in `.agent/context/handoffs/NN-core-debugging.md` per `references/output-contract.md`.

## References index
- `references/js-errors.md`: JavaScript error patterns & fixes.
- `references/ts-errors.md`: TypeScript compiler error patterns & fixes.
- `references/python-errors.md`: Python exception patterns & fixes.
- `references/build-errors.md`: Bundling & build tool error patterns & fixes.
- `references/dependency-errors.md`: Package manager & lockfile error patterns & fixes.
- `references/database-errors.md`: Database connection & ORM error patterns & fixes.
- `references/api-errors.md`: API HTTP & contract error patterns & fixes.
- `references/auth-errors.md`: Auth & permission error patterns & fixes.
- `references/deployment-errors.md`: Deployment & CI/CD error patterns & fixes.
- `references/docker-errors.md`: Docker & container error patterns & fixes.
- `references/env-var-errors.md`: Environment variable error patterns & fixes.
- `references/network-errors.md`: Network & connectivity error patterns & fixes.
- `references/runtime-errors.md`: General process runtime error patterns & fixes.
- `references/context-contract.md`: Schema for project context.
- `references/output-contract.md`: Standard handoff output structure.
- `references/approval-levels.md`: Risk levels and escalation rules.
- `references/untrusted-content.md`: Untrusted content handling rules.
