# Metrics & Tracing Guidelines

## 1. RED Method (Services)
- **Rate**: `http_requests_total{method="POST", path="/api/checkout"}` (Counter)
- **Errors**: `http_requests_failed_total{status=~"5.."}` (Counter)
- **Duration**: `http_request_duration_seconds` (Histogram with standard buckets: `0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10`)

## 2. USE Method (Resources)
- **Utilization**: CPU %, Memory %, Disk %, Connection Pool usage %
- **Saturation**: Queue length, thread pool wait queue size
- **Errors**: Hardware / OS error counts

## 3. OpenTelemetry (OTel) Tracing
Pass W3C trace context headers (`traceparent`, `tracestate`) across HTTP/gRPC boundaries to visualize end-to-end request journeys.
