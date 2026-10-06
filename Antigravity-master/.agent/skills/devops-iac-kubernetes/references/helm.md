# Helm Chart Management

## Chart Structure
```
charts/my-app/
├── Chart.yaml
├── values.yaml
├── values-staging.yaml
├── values-production.yaml
└── templates/
    ├── deployment.yaml
    ├── service.yaml
    └── ingress.yaml
```

## Idempotent Upgrade Command
```bash
# Dry-run first (always)
helm upgrade --install my-app ./charts/my-app \
  -f values-production.yaml \
  --dry-run

# Apply only after human review of dry-run output (CRITICAL)
helm upgrade --install my-app ./charts/my-app \
  -f values-production.yaml \
  --atomic --timeout 5m
```
