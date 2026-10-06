# Alerts & Grafana Dashboards

## Prometheus Alert Rules Example

```yaml
groups:
  - name: service_alerts
    rules:
      - alert: HighErrorRate
        expr: sum(rate(http_requests_total{status=~"5.."}[5m])) / sum(rate(http_requests_total[5m])) > 0.05
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "High 5xx error rate detected (> 5%)"

      - alert: HighLatencyP99
        expr: histogram_quantile(0.99, sum(rate(http_request_duration_seconds_bucket[5m])) by (le)) > 2.0
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "P99 latency exceeds 2 seconds"
```
