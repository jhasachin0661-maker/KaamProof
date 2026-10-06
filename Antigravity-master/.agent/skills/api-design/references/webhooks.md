# Webhooks Design Standards

## Payload Envelope
```json
{
  "id": "evt_12345",
  "object": "event",
  "type": "invoice.payment_succeeded",
  "created": 1775000000,
  "data": {
    "object": { ... }
  }
}
```

## Security & Verification
- Sign webhook requests with HMAC-SHA256 signature in HTTP header (`X-Webhook-Signature`).
- Include timestamp in signature payload to prevent replay attacks.
