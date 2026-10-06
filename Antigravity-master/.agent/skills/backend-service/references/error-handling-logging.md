# Error Handling & Structured Logging

## Error Model
- Define custom application domain exception classes (e.g. `NotFoundError`, `UnauthorizedError`, `ValidationError`).
- Centralize HTTP error mapping in global error handler middleware.

## Logging & Secret Masking
- Output structured JSON logs (using Pino, Winston, structlog).
- Automatically redact sensitive keys: `password`, `token`, `authorization`, `secret`, `credit_card`.
