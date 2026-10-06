---
name: cloud-deployment
description: Deploy applications and manage infrastructure across cloud providers (Vercel, Cloudflare, Supabase, Firebase, AWS, Azure, GCP). Handle serverless, container hosting, object storage, CDN, DNS, SSL/TLS, and networking. Preview/staging deployments are HIGH risk; production deployments are CRITICAL risk requiring explicit approval.
metadata:
  category: cloud
  priority: P1
  layer: deliver
  version: 0.1.0
  reads_from: devops-ci-cd, config-env-secrets
  risk_max: CRITICAL
---

# Cloud Deployment

## Purpose
Deploy applications, microservices, and static assets across major cloud providers (Vercel, Cloudflare Workers/Pages, Supabase, Firebase, AWS, Azure, GCP). Manage compute topologies (serverless vs containers), object storage buckets, CDN caching, custom domain DNS records, SSL/TLS certificates, and cloud networking. Preview and staging deployments carry `HIGH` risk; production deployments carry `CRITICAL` risk requiring explicit human approval.

## When NOT to use
- Do not use for authoring local Dockerfiles or local Docker Compose files (use `devops-containers`).
- Do not use for managing raw Kubernetes YAML or Terraform HCL definitions (use `devops-iac-kubernetes`).

## Inputs
- Application build artifacts, cloud CLI configurations (`vercel.json`, `wrangler.toml`, `firebase.json`, AWS/GCP/Azure configs), `.agent/context/project-context.json`.

## Procedure
1. **Provider & Compute Topology Selection**:
   - Detect targeted cloud platform and compute architecture. Consult provider-specific references:
     - Vercel: `references/vercel.md`
     - Cloudflare: `references/cloudflare.md`
     - Supabase & Firebase: `references/supabase-firebase.md`
     - AWS: `references/aws.md`
     - Azure: `references/azure.md`
     - GCP: `references/gcp.md`
2. **Domain, DNS & SSL/TLS Configuration**:
   - Configure DNS records (A, CNAME, ALIAS) and SSL/TLS certificates (Let's Encrypt, Cloudflare ACM, AWS ACM) per `references/dns-tls.md`.
3. **Staging / Preview Deployment (`HIGH` Risk)**:
   - Deploy preview/staging environment branch. Verify deployment output URL, environment variables, and health checks.
4. **Production Deployment (`CRITICAL` Risk)**:
   - Before triggering production deployment or DNS cutover, pause and present exact action details, target cloud provider, blast radius, dry-run output, and rollback plan to human user for explicit approval (`CRITICAL` level).
5. **Post-Deployment Verification**:
   - Perform smoke tests on live endpoints (`curl -f https://myapp.com/health`). Verify SSL certificate validity and CDN cache status.

## Validation
- Deployment dry-run passes cleanly with 0 configuration errors.
- Target cloud health checks return HTTP 200 OK on deployed URL.
- Production deployments carry recorded explicit human approval.

## Failure handling
- If cloud deployment fails or live health check returns 5xx error, immediately execute rollback strategy (switch active deployment alias / DNS pointer), capture cloud logs, and issue incident report.

## Approval touchpoints
- Refer to `references/approval-levels.md`.
- `HIGH`: Preview/staging deployments, non-production cloud resource creation, staging DNS edits.
- `CRITICAL`: Production deployments, production DNS cutovers, destroying cloud infrastructure, or credential rotations. Requires explicit human approval.

## Output
- Handoff file in `.agent/context/handoffs/NN-cloud-deployment.md` per `references/output-contract.md`.
- Deployed application URLs, DNS records, and cloud deployment summary report.

## References index
- `references/vercel.md`: Vercel project deployment, serverless functions, and edge middleware.
- `references/cloudflare.md`: Cloudflare Workers, Pages, R2 object storage, and DNS routing.
- `references/supabase-firebase.md`: Supabase and Firebase hosting, auth, and backend integrations.
- `references/aws.md`: AWS ECS, Fargate, Lambda, S3, CloudFront, and Route 53 deployments.
- `references/azure.md`: Azure App Service, Container Apps, Blob Storage, and Azure Front Door.
- `references/gcp.md`: GCP Cloud Run, Cloud Functions, Cloud Storage, and Cloud Load Balancing.
- `references/dns-tls.md`: DNS records, SSL/TLS certificate provisioning, and CDN routing rules.
- `references/context-contract.md`: Schema for project context.
- `references/output-contract.md`: Standard handoff output structure.
- `references/approval-levels.md`: Operational risk levels.
- `references/untrusted-content.md`: Untrusted content handling rules.
