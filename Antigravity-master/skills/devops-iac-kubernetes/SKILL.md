---
name: devops-iac-kubernetes
description: Terraform/IaC and Kubernetes/Helm management; always plan/dry-run first; apply to non-local is CRITICAL; destroy is CRITICAL with explicit per-action approval. Trigger whenever writing Terraform, Kubernetes manifests, or Helm charts, managing cloud infrastructure as code, or deploying to a Kubernetes cluster, even if IaC is not named.
metadata:
  category: devops
  priority: P2
  layer: deliver
  version: 0.1.0
  reads_from: devops-containers, cloud-deployment
  risk_max: CRITICAL
---

# DevOps IaC & Kubernetes

## Purpose
Author, validate, and apply Terraform infrastructure-as-code and Kubernetes/Helm manifests. Enforces a strict plan-before-apply discipline: every infrastructure change must generate and present a dry-run plan output to the human before applying. Applying to non-local environments and `terraform destroy` are `CRITICAL` risk operations requiring explicit per-action approval.

## When NOT to use
- Do not use for Docker Compose local dev environment setup (use `devops-containers`).
- Do not use for cloud provider-specific CLI deployments without IaC management (use `cloud-deployment`).

## Inputs
- Terraform `.tf` files, Kubernetes YAML manifests, Helm charts, `.agent/context/project-context.json`.

## Procedure
1. **Plan Before Apply (Mandatory)**:
   - Always run `terraform plan` or `helm diff` first and present the output diff for human review before running `terraform apply`. Refer to `references/plan-before-apply.md`.
2. **Terraform IaC**:
   - Author modular Terraform configurations (provider, variables, outputs, state backend). Refer to `references/terraform.md`.
3. **Kubernetes Manifest Authoring**:
   - Write and validate Deployment, Service, ConfigMap, Secret, Ingress, and RBAC resources per `references/kubernetes.md`.
4. **Helm Chart Management**:
   - Package applications as Helm charts, manage `values.yaml` environments, and use `helm upgrade --install` idempotently per `references/helm.md`.
5. **Destroy Safety Protocol**:
   - Any `terraform destroy` must pause, present exact resources targeted, blast radius, rollback options, and receive explicit human approval (`CRITICAL`).

## Validation
- `terraform validate` passes (exit code 0).
- `terraform plan` output reviewed before any apply.
- Kubernetes manifests pass `kubectl --dry-run=client` validation.

## Failure handling
- If `terraform apply` or Helm upgrade fails mid-execution, capture state error, avoid re-running destructively, and issue a precise blocker report for human remediation.

## Approval touchpoints
- Refer to `references/approval-levels.md`.
- `MEDIUM`: Local plan/dry-run generation and lint validation.
- `CRITICAL`: `terraform apply` or `helm upgrade` against non-local environments; `terraform destroy`; any production infra change. Requires explicit per-action approval.

## Output
- Handoff file in `.agent/context/handoffs/NN-devops-iac-kubernetes.md` per `references/output-contract.md`.
- Validated Terraform modules, Kubernetes YAML, and Helm chart files.

## References index
- `references/terraform.md`: Terraform module patterns, state backend config, and workspace management.
- `references/kubernetes.md`: Kubernetes resource authoring, RBAC, Ingress, and manifest validation.
- `references/helm.md`: Helm chart structure, values.yaml management, and idempotent upgrade patterns.
- `references/plan-before-apply.md`: Plan-before-apply safety protocol and human approval gate rules.
- `references/context-contract.md`: Schema for project context.
- `references/output-contract.md`: Standard handoff output structure.
- `references/approval-levels.md`: Operational risk levels.
- `references/untrusted-content.md`: Untrusted content handling rules.
