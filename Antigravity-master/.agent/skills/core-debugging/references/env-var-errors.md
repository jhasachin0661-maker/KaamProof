# Environment Variable Error Guide

## Symptoms & Error Codes
- `process.env.DATABASE_URL is undefined`
- `KeyError: 'API_KEY'`
- `ConfigError: Missing required environment variable`

## Usual Causes
1. `.env` file not loaded at process startup.
2. Missing variable definition in `.env` or `.env.local`.
3. Client-side code trying to access server-side env vars without public prefix (`NEXT_PUBLIC_` / `VITE_`).

## Diagnostic Commands
- Run env check script: `python scripts/find_env_usage.py`

## Safe Fixes
- Add variable definition to `.env.example` and local `.env`.
- Use `dotenv` or framework config helper at process entry point.
