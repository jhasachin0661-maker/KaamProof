# Quality Check Matrix by Project Profile

## Applicable Check Groups

### Web App & SaaS
- Code: Build, Lint, Types, Tests
- Security: Secrets, Vulns, Auth, Input Validation
- UI: Responsive, Accessibility, Visual Consistency, Loading/Error States
- Backend: API Contract, Errors, Validation, Logging
- Database: Migrations, Indexes, Constraints
- Deployment: Build Output, Env Vars, Prod Config
- Docs: README, Setup, API Docs

### REST API & Backend Service
- Code: Build, Lint, Types, Tests
- Security: Secrets, Vulns, Auth, Input Validation
- UI: N/A (Skip with reason: backend service profile)
- Backend: API Contract, Errors, Validation, Logging
- Database: Migrations, Indexes, Constraints
- Deployment: Build Output, Env Vars, Prod Config
- Docs: README, API Specs

### CLI & Automation Tool
- Code: Build, Lint, Types, Tests
- Security: Secrets, Command Injections
- UI: N/A
- Backend: N/A
- Database: N/A
- Deployment: CLI Package Build
- Docs: Help Commands, Man Pages, Usage Examples
