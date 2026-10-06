# Build & Bundling Error Guide

## Symptoms & Error Codes
- `Module parse failed: Unexpected token`
- `Vite build failed: Could not resolve entry module`
- `Next.js build failed: Export encounter error`

## Usual Causes
1. Missing loader or plugin configuration (e.g. Babel, SWC, PostCSS).
2. Unresolved path alias in `tsconfig.json` or bundler config.
3. Server component importing client-only code in Next.js App Router.

## Diagnostic Commands
- Run build command: `npm run build` or `npx vite build`

## Safe Fixes
- Add `'use client'` directive to components using hooks in Next.js.
- Ensure path aliases match between `tsconfig.json` and bundler config (`vite.config.ts` / `next.config.ts`).
