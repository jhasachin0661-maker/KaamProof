---
name: devops-containers
description: Dockerfile and Compose authoring and hardening, multi-stage builds, non-root users, image size optimization, local environment parity, and container security. Trigger whenever authoring Dockerfiles, writing docker-compose.yml files, or hardening containerized applications, even if containers are not explicitly named.
metadata:
  category: devops
  priority: P1
  layer: deliver
  version: 0.1.0
  reads_from: config-env-secrets
  risk_max: MEDIUM
---

# DevOps Containers

## Purpose
Author, optimize, and secure Docker containers and Docker Compose environments. Enforce multi-stage build patterns, non-root user execution, minimal base images (Alpine/Distroless), build cache optimization, environment parity between local dev and production, and container security hardening.

## When NOT to use
- Do not use for managing Kubernetes manifests, Helm charts, or Terraform IaC (use `devops-iac-kubernetes`).
- Do not use for cloud hosting deployment execution alone (use `cloud-deployment`).

## Inputs
- `Dockerfile`, `docker-compose.yml`, `.dockerignore`, `.agent/context/project-context.json`.

## Procedure
1. **Dockerfile Authoring & Multi-Stage Builds**:
   - Construct production Dockerfiles using multi-stage builds to separate build toolchains from final runtime artifacts. Refer to `references/dockerfile.md`.
   - Minimize image layer count and optimize `.dockerignore` to exclude `node_modules`, `.git`, `.env`, and temporary files.
2. **Container Security & Hardening**:
   - Enforce non-root user execution (`USER node` or `USER appuser`) to prevent privilege escalation. Refer to `references/hardening.md`.
   - Set explicit read-only root filesystem flags where applicable and drop unnecessary Linux capabilities (`cap_drop: [ALL]`).
   - Use verified, minimal base images (`node:20-alpine`, `python:3.11-slim`, `gcr.io/distroless/static`).
3. **Docker Compose & Dev Parity**:
   - Define local development and test environments using `docker-compose.yml`. Refer to `references/compose.md`.
   - Configure health checks (`healthcheck`), volume mounts for dev hot-reloading, networks, and environment variables.
4. **Validation & Security Scan**:
   - Validate Dockerfile syntax using `hadolint`.
   - Run container vulnerability scans (`trivy image <image_name>`). Ensure zero high/critical vulnerabilities.

## Validation
- `Dockerfile` passes multi-stage verification and executes under non-root user (`USER`).
- Image size optimized (< 200MB target for web Node/Python services).
- `docker compose config` validates clean syntax (exit code 0).

## Failure handling
- If container build fails or healthcheck times out, inspect `docker logs`, fix missing dependency or permission issue in Dockerfile, and rebuild image.

## Approval touchpoints
- Refer to `references/approval-levels.md`.
- `MEDIUM`: Authoring or modifying Dockerfiles, Compose configurations, and container build scripts. Autonomous with git checkpoint.

## Output
- Handoff file in `.agent/context/handoffs/NN-devops-containers.md` per `references/output-contract.md`.
- Hardened `Dockerfile`, `.dockerignore`, and `docker-compose.yml` files.

## References index
- `references/dockerfile.md`: Multi-stage build patterns, layer caching, and image size reduction rules.
- `references/compose.md`: Docker Compose configuration, service networking, volumes, and healthchecks.
- `references/hardening.md`: Container security, non-root users, capability dropping, and vulnerability scanning.
- `references/context-contract.md`: Schema for project context.
- `references/output-contract.md`: Standard handoff output structure.
- `references/approval-levels.md`: Operational risk levels.
- `references/untrusted-content.md`: Untrusted content handling rules.
