# Dependency & Lockfile Error Guide

## Symptoms & Error Codes
- `ERR_PNPM_INVALID_PACKAGE_KEY`
- `ERESOLVE unable to resolve dependency tree`
- `npm ERR! code ERESOLVE`

## Usual Causes
1. Conflicting peer dependencies across packages.
2. Corrupted lockfile (`package-lock.json`, `pnpm-lock.yaml`, `yarn.lock`).
3. Outdated Node.js engine version specified in `package.json` `engines`.

## Diagnostic Commands
- Run package manager check: `npm ls` or `pnpm doctor`

## Safe Fixes
- Run `npm install --legacy-peer-deps` or deduplicate lockfile.
- Delete `node_modules` and re-install using lockfile (`npm ci` / `pnpm install --frozen-lockfile`).
