# API & HTTP Contract Error Guide

## Symptoms & Error Codes
- `HTTP 404 Not Found`
- `HTTP 500 Internal Server Error`
- `CORS error: No 'Access-Control-Allow-Origin' header`

## Usual Causes
1. Route handler path mismatch or missing route export.
2. Unhandled exception in backend controller or route handler.
3. CORS configuration missing allowed origins.

## Diagnostic Commands
- Run curl request: `curl -v http://localhost:3000/api/endpoint`

## Safe Fixes
- Export correct HTTP method function in App Router (`export async function GET()`).
- Add CORS middleware options for target frontend origin.
- Add try/catch block returning standard JSON error payload `{ error: message }`.
