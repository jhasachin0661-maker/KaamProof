# Cloudflare Workers & Pages Deployment Guide

## CLI Commands (Wrangler)
- Preview / Dev: `npx wrangler dev`
- Deploy Worker: `npx wrangler deploy` (Production is CRITICAL)
- Deploy Pages: `npx wrangler pages deploy ./dist`

## `wrangler.toml` Configuration
```toml
name = "my-worker"
main = "src/index.ts"
compatibility_date = "2026-10-03"

[env.production]
name = "my-worker-prod"
```
