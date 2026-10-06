# Deployment & CI/CD Error Guide

## Symptoms & Error Codes
- `Vercel Build Command failed`
- `GitHub Actions workflow failed at step 'Build'`
- `Environment variable missing during build phase`

## Usual Causes
1. Environment variables set locally but missing in deployment platform dashboard.
2. Build command failure due to strict TypeScript or ESLint rules in production mode.

## Diagnostic Commands
- Test production build locally: `npm run build`

## Safe Fixes
- Add missing environment variables in deployment dashboard settings.
- Fix all build-blocking lint and type errors locally.
