# Node.js Package Management (npm, pnpm, yarn)

## Commands by Package Manager

### npm
- Outdated check: `npm outdated`
- Audit vulnerabilities: `npm audit`
- Fix vulnerabilities: `npm audit fix`
- Prune unused: `npm prune`
- Lockfile verify: `npm ci --dry-run`

### pnpm
- Outdated check: `pnpm outdated`
- Audit vulnerabilities: `pnpm audit`
- Lockfile verify: `pnpm install --frozen-lockfile`

### yarn
- Outdated check: `yarn outdated`
- Audit vulnerabilities: `yarn audit`
- Lockfile verify: `yarn install --immutable`

## Best Practices
- Keep peer dependencies synchronized.
- Ensure lockfile is updated in the same commit as `package.json`.
- Scan for unused packages using tools like `depcheck` or `knip`.
