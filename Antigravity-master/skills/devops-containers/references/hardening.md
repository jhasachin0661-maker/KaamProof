# Container Hardening & Security Checklist

## 1. Non-Root Execution
Never run container processes as `root` (UID 0). Always create and switch to a unprivileged user:

```dockerfile
USER appuser
```

## 2. Minimal Base Images
- Use `alpine` or `distroless` base images instead of full OS images (Ubuntu/Debian) to shrink attack surface.

## 3. Drop Capabilities
In Docker Compose or Kubernetes, drop all unnecessary Linux capabilities:

```yaml
security_opt:
  - no-new-privileges:true
cap_drop:
  - ALL
```

## 4. No Hardcoded Secrets
Never embed passwords, API keys, or certificates inside Dockerfile `ENV` or `RUN` layers.
