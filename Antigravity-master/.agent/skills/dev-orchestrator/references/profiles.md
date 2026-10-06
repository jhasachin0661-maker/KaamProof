# Ecosystem Profiles & Skill Bundles

Profiles define recommended skill sets for specific application domains. Every profile includes the **BASE** profile skills.

## BASE Profile (Included in All Projects)
- `dev-orchestrator`
- `core-repo-discovery`
- `core-implementation`
- `core-debugging`
- `core-research`
- `config-env-secrets`
- `security-secure-coding`
- `testing-engineering`
- `git-workflow`
- `quality-release-gate`
*(Plus `core-requirements-planning` when greenfield or requirements are vague)*

## Domain-Specific Profiles

### 1. Web App
`BASE` + `uiux-visual-design`, `uiux-design-critique`, `frontend-web-app`, `frontend-accessibility`, `testing-e2e-browser`, `perf-engineering`, `docs-engineering` *(+ `seo-technical` if public)*.

### 2. SaaS
`Web App` + `arch-system-design`, `product-strategy`, `backend-service`, `api-design`, `database-design`, `database-migrations-orm`, `auth-authentication`, `auth-authorization`, `security-threat-modeling`, `security-scanning`, `devops-ci-cd`, `cloud-deployment`, `ops-observability`.

### 3. REST API
`BASE` + `arch-system-design`, `backend-service`, `api-design`, `database-design`, `database-migrations-orm`, `auth-authentication`, `auth-authorization`, `security-scanning`, `devops-ci-cd`, `devops-containers`, `ops-observability`, `perf-engineering`, `docs-engineering`.

### 4. Mobile App
`BASE` + `uiux-research-flows`, `uiux-visual-design`, `api-design`, `auth-authentication`, `perf-engineering`, `mobile-app`.

### 5. Desktop App
`BASE` + `uiux-visual-design`, `security-scanning`, `release-management`, `desktop-app`.

### 6. AI Application
`BASE` + `backend-service`, `api-design`, `security-scanning`, `perf-engineering`, `ai-llm-integration` *(+ `frontend-web-app` if UI present)*.

### 7. RAG Application
`AI Application` + `database-design`, `ai-rag-search`, `data-pipelines-analytics`.

### 8. Computer Vision
`BASE` + `backend-service`, `perf-engineering`, `ai-vision-ml`, `data-pipelines-analytics`.

### 9. Data Application
`BASE` + `database-design`, `database-migrations-orm`, `perf-engineering`, `data-pipelines-analytics` *(+ `frontend-web-app` for dashboards)*.

### 10. E-commerce
`SaaS` + `perf-engineering`, `seo-technical` *(Payments operations are CRITICAL risk)*.

### 11. Dashboard
`BASE` + `uiux-visual-design`, `frontend-web-app`, `frontend-accessibility`, `api-design`, `data-pipelines-analytics`, `perf-engineering`.

### 12. Portfolio
`BASE` + `uiux-visual-design`, `uiux-design-critique`, `frontend-web-app`, `frontend-accessibility`, `cloud-deployment`, `perf-engineering`, `seo-technical`.

### 13. CLI
`BASE` + `release-management`, `docs-engineering`, `app-cli-extension-automation`.

### 14. Browser Extension
`BASE` + `frontend-web-app`, `release-management`, `app-cli-extension-automation` *(Permission minimization required)*.

### 15. Automation Tool
`BASE` + `config-env-secrets`, `ops-observability`, `app-cli-extension-automation`.

### 16. Full-Stack App
`BASE` + `uiux-visual-design`, `frontend-web-app`, `frontend-accessibility`, `backend-service`, `api-design`, `database-design`, `database-migrations-orm`, `auth-authentication`, `auth-authorization`, `testing-e2e-browser`, `devops-ci-cd`, `cloud-deployment`, `docs-engineering`.
