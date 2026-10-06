# Vulnerability Severity Rubric

## Severity Levels

### CRITICAL
- Direct remote code execution, unauthenticated full database compromise, or complete auth bypass.
- Immediate action required: block deployment release.

### HIGH
- Authenticated privilege escalation, stored XSS on sensitive admin routes, SQL injection on restricted endpoints, or cleartext secret exposure in repository.

### MEDIUM
- Reflected XSS, CSRF on non-critical actions, missing rate limits, weak password policies, or misconfigured security headers.

### LOW
- Verbose debug logs, missing hardening headers without direct exploitability, software version disclosure.

### INFO
- Informational security recommendations, code hygiene improvements, or hardening opportunities.
