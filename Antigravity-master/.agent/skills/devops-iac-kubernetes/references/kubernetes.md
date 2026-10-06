# Kubernetes Manifest Authoring

## Deployment Resource
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend-api
  namespace: production
spec:
  replicas: 3
  selector:
    matchLabels:
      app: backend-api
  template:
    metadata:
      labels:
        app: backend-api
    spec:
      securityContext:
        runAsNonRoot: true
        runAsUser: 1000
      containers:
        - name: api
          image: my-registry/backend-api:v1.2.0
          ports:
            - containerPort: 3000
          resources:
            requests:
              cpu: "100m"
              memory: "128Mi"
            limits:
              cpu: "500m"
              memory: "512Mi"
          readinessProbe:
            httpGet:
              path: /health/readiness
              port: 3000
```

## Dry-Run Validation
```bash
kubectl apply -f manifests/ --dry-run=client
```
