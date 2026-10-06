# Vercel Deployment Guide

## CLI Commands
- Preview deployment: `vercel`
- Production deployment: `vercel --prod` (CRITICAL risk)

## `vercel.json` Configuration
```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "regions": ["iad1"]
}
```

## Environment Variables
- Set via Vercel Dashboard or CLI: `vercel env add MY_VAR production`
