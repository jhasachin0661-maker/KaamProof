# General Runtime Error Guide

## Symptoms & Error Codes
- `FATAL ERROR: CALL_AND_RETRY_LAST Allocation failed - JavaScript heap out of memory`
- `UnhandledPromiseRejectionWarning`
- `Segmentation fault (core dumped)`
- Process exits with non-zero code without clear error message.

## Usual Causes
1. Memory leak from unbounded data structures or unclosed streams.
2. Unhandled promise rejection crashing Node.js process.
3. Infinite loop or recursive call stack overflow.

## Diagnostic Commands
- Run with verbose output: `NODE_OPTIONS="--max-old-space-size=4096" node app.js`
- Check for unhandled rejections: `node --unhandled-rejections=strict app.js`

## Safe Fixes
- Add `.catch()` handlers or `try/catch` around async operations.
- Profile memory usage to locate leak source.
- Add recursion depth guards or loop iteration limits.
