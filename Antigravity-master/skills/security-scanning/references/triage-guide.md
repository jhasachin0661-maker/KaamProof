# Security Finding Triage Guide

## Severity Classification Matrix

| Severity | Definition | Action Required |
|---|---|---|
| **CRITICAL** | Remote Code Execution (RCE), unauthenticated SQLi, exposed private SSH/API keys. | Immediate blocking fix required. Cannot release. |
| **HIGH** | Authenticated SQLi, Stored XSS, broken access control (IDOR), high CVE in direct dependency. | Fix before deployment. |
| **MEDIUM** | Reflected XSS, weak CORS policy, missing security headers (HSTS, CSP). | Remediate in current sprint. |
| **LOW** | Informational disclosure, minor dependency patch update. | Track in backlog. |

## Triage Workflow
1. **Verify Exposure**: Check if vulnerable code path is reachable in application context.
2. **Eliminate False Positives**: Document evidence if finding is in test files, dummy mocks, or unreachable code.
3. **Formulate Patch**: Apply minimum safe diff to resolve root vulnerability.
