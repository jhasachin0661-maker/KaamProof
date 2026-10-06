# Troubleshooting Guide

## Common Issues & Resolutions

### Issue 1: Database Connection Refused (`ECONNREFUSED 127.0.0.1:5432`)
- **Symptoms**: Application crashes on launch with database connection error.
- **Root Cause**: PostgreSQL service is not running or `.env` configuration has invalid port.
- **Resolution**:
  1. Start local PostgreSQL: `docker compose up -d db`
  2. Verify `DATABASE_URL` matches credentials in `.env`.

### Issue 2: Build Failures After Dependency Upgrade
- **Symptoms**: Type check or build fails after running package updates.
- **Resolution**:
  1. Clear package cache and re-install: `rm -rf node_modules package-lock.json && npm install`
  2. Re-run type check: `npm run typecheck`
