# Structured Logging & Redaction Guidelines

## 1. JSON Format Standard
Every log entry MUST be printed as single-line JSON:

```json
{
  "timestamp": "2026-10-03T13:41:00.000Z",
  "level": "info",
  "service": "order-service",
  "trace_id": "4bf92f3577b34da6a3ce929d0e0e4736",
  "span_id": "00f067aa0ba902b7",
  "msg": "Order processed successfully",
  "order_id": "ord_99812",
  "duration_ms": 42
}
```

## 2. Redaction Safety Rules (Mandatory)
Automatically censor sensitive keys in log formatters:
- Keys to redact: `password`, `token`, `secret`, `authorization`, `credit_card`, `ssn`, `api_key`.
- Value replacement: `"[REDACTED]"`

## 3. Log Levels
- `FATAL`: Process exiting due to unrecoverable system failure.
- `ERROR`: Handler failure or exception requiring immediate attention.
- `WARN`: Degradation or fallback mode activated.
- `INFO`: Normal operational milestones (server startup, batch processing).
- `DEBUG`: Detailed diagnostic info (disabled in production).
