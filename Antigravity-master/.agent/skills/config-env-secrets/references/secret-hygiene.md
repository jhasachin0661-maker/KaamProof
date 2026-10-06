# Secret Hygiene & Parity Guidelines

Strict rules for managing API tokens, passwords, database credentials, and private keys.

## Fundamental Rules
1. **NAMES ONLY**: `.env.example` and public documentation must contain variable NAMES ONLY (`DATABASE_URL=`, `API_KEY=`). Never include actual values or default fallback secrets.
2. **Gitignore Enforcement**: `.gitignore` MUST contain:
   ```gitignore
   .env
   .env.local
   .env.*.local
   *.pem
   *.key
   id_rsa
   ```
3. **Log Sanitization**: NEVER print, echo, or commit secret values to console logs, error tracebacks, context files, or pull requests.
4. **Committed Secret Remediation**:
   - If a secret is committed in working tree: remove the secret value, revoke/rotate the compromised credential immediately.
   - If a secret is committed in git history: history rewriting (`git filter-repo` / `bfg`) is a **HIGH** risk operation requiring explicit human approval.

## Environment Parity
- **Local**: Development mocks or local container connections.
- **Staging**: Staging integration endpoints; real credentials isolated from production.
- **Production**: Production endpoints; secrets managed exclusively via secrets manager (AWS Secrets Manager, GCP Secret Manager, Vault) or CI/CD environment variables.
