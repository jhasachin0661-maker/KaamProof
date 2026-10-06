# Sentry & OpenTelemetry Integration

## Sentry Setup
```javascript
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV || "production",
  tracesSampleRate: 0.1,
  beforeSend(event) {
    // Redact sensitive data from event frames
    if (event.request && event.request.headers) {
      delete event.request.headers["authorization"];
      delete event.request.headers["cookie"];
    }
    return event;
  }
});
```

## OpenTelemetry Node.js Initialization
```javascript
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';

const sdk = new NodeSDK({
  traceExporter: new OTLPTraceExporter(),
  instrumentations: [getNodeAutoInstrumentations()]
});
sdk.start();
```
