# Incident Response Runbook Template

# Runbook: High 5xx Error Rate (`HighErrorRate`)

## Severity
CRITICAL

## Initial Triage Steps
1. Open Grafana Dashboard: `https://grafana.internal/d/service-overview`
2. Check Sentry Issues: Filter by `service:backend-service` and `environment:production`.
3. Query logs for 5xx stack traces:
   ```bash
   kubectl logs -n prod -l app=backend --tail=100 | grep '"level":"error"'
   ```

## Common Root Causes & Mitigations
- **Cause 1: Database Connection Pool Exhaustion**
  - **Mitigation**: Scale up database connections or restart web pods (`kubectl rollout restart deployment/backend`).
- **Cause 2: Upstream API Timeout**
  - **Mitigation**: Enable circuit breaker fallback mode via feature flag.
