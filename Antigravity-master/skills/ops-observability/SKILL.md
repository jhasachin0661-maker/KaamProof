---
name: ops-observability
description: Structured logging, metrics, tracing, error monitoring, health checks, uptime, audit logs, alerts, dashboards (Sentry, OpenTelemetry, Prometheus, Grafana), and incident response runbooks. Never log secrets or PII. Trigger whenever implementing telemetry, setting up monitoring, configuring alerts, or authoring incident runbooks, even if observability is not explicitly named.
metadata:
  category: ops
  priority: P1
  layer: deliver
  version: 0.1.0
  reads_from: backend-service
  risk_max: MEDIUM
---

# Ops Observability

## Purpose
Build robust end-to-end observability across backend services, applications, and infrastructure using structured JSON logging, metrics aggregation, distributed OpenTelemetry tracing, error monitoring (Sentry), health check probes, audit logs, alerting rules, Grafana dashboards, and incident response runbooks. Enforce a strict zero-leakage safety policy: NEVER log raw credentials, secrets, tokens, or PII.

## When NOT to use
- Do not use for writing core application business logic or backend API handlers (use `backend-service`).
- Do not use for performance profiling or micro-benchmarking code paths (use `perf-engineering`).

## Inputs
- Application source code, logger configuration, OpenTelemetry setup, `.agent/context/project-context.json`.

## Procedure
1. **Structured Logging & Secret Masking**:
   - Implement JSON structured logging (winston, pino, structlog, zerolog) with context fields (`trace_id`, `span_id`, `service_name`, `timestamp`, `level`). Refer to `references/logging.md`.
   - Apply automatic redaction filters for PII (passwords, tokens, SSNs, credit cards, emails).
2. **Metrics & Distributed Tracing**:
   - Implement RED (Rate, Errors, Duration) and USE (Utilization, Saturation, Errors) metrics using Prometheus counters/histograms. Refer to `references/metrics-tracing.md`.
   - Instrument OpenTelemetry (OTel) SDKs for distributed HTTP/gRPC span context propagation across services. Refer to `references/sentry-otel.md`.
3. **Error Monitoring & Health Probes**:
   - Configure Sentry SDK for unhandled exception capture, breadcrumbs, and release tracking.
   - Implement standard health check endpoints (`GET /health/liveness`, `GET /health/readiness`).
4. **Alerts & Dashboards**:
   - Define Prometheus / Grafana alert rules (SLO/SLA burn rate, high 5xx error rate, high P99 latency) per `references/alerts-dashboards.md`.
5. **Incident Response Runbooks**:
   - Author incident response runbooks in `docs/runbooks/` detailing triage steps, diagnostic queries, and mitigation actions for common alerts per `references/incident-response.md`.

## Validation
- Log output verified as valid structured JSON with secrets/PII sanitized.
- Health check endpoints (`/health/liveness`, `/health/readiness`) return HTTP 200 OK.
- Alerting rules and OTel instrumentation pass syntax validation.

## Failure handling
- If logger fails or telemetry exporter drops connections, catch exporter errors, fall back to stdout JSON logging, and prevent application blocking.

## Approval touchpoints
- Refer to `references/approval-levels.md`.
- `MEDIUM`: Adding telemetry SDKs, editing logger configurations, and configuring alerting rules.

## Output
- Handoff file in `.agent/context/handoffs/NN-ops-observability.md` per `references/output-contract.md`.
- Telemetry instrumentation code, Prometheus alert rules, Grafana dashboard JSON, and `docs/runbooks/*.md`.

## References index
- `references/logging.md`: Structured JSON logging, log levels, and automatic secret/PII redaction.
- `references/metrics-tracing.md`: Prometheus metrics (RED/USE methods) and OpenTelemetry distributed tracing.
- `references/sentry-otel.md`: Sentry error capture, OTel SDK setup, and trace-to-log correlation.
- `references/alerts-dashboards.md`: Prometheus alert definitions, Grafana dashboard specs, and SLO/SLA targets.
- `references/incident-response.md`: Incident response runbook structure and triage workflows.
- `references/context-contract.md`: Schema for project context.
- `references/output-contract.md`: Standard handoff output structure.
- `references/approval-levels.md`: Operational risk levels.
- `references/untrusted-content.md`: Untrusted content handling rules.
