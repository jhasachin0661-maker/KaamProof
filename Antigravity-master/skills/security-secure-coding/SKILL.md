---
name: security-secure-coding
description: Defensive security review for code touching user input, files, network, auth, databases, templates, redirects, or uploads. Trigger on any code change, security review request, or is this secure prompt, even when security is not explicitly named. Reviews OWASP Top 10 and ASVS findings with severity and file:line evidence.
metadata:
  category: security
  priority: P0
  layer: verify
  version: 0.1.0
  reads_from: core-repo-discovery
  risk_max: LOW
---

# Security Secure Coding

## Purpose
Perform defensive security review of code changes against OWASP Top 10 and ASVS standards. Output findings with severity rating, exact file:line evidence, impact description, and proposed or applied remediations. This skill is strictly for defensive review of local codebase files.

## When NOT to use
- Do not use for active penetration testing against external hosts or non-localhost endpoints without explicit HIGH approval.
- Do not use for generating offensive exploit payloads outside minimal local verification proofs against user code.

## Inputs
- Workspace code changes, diffs, and updated files.
- `.agent/context/project-context.json` for stack information and data sensitivity settings.

## Procedure
1. **Scope Assessment**: Evaluate changed files against OWASP Top 10 categories. Refer to `references/owasp-top10-checklist.md`.
2. **Injection Analysis**: Inspect SQL, NoSQL, ORM, command execution, and template rendering logic for parameterized parameter handling. Refer to `references/injection.md`.
3. **XSS & CSRF Verification**: Check HTML rendering, template escaping, cookie flags (SameSite, HttpOnly, Secure), and state-changing request protection. Refer to `references/xss-csrf.md`.
4. **SSRF & Path Traversal Review**: Validate outgoing HTTP client requests, URL parsers, file system reads/writes, and path sanitization. Refer to `references/ssrf-path-traversal.md`.
5. **Headers, CSP & CORS Audit**: Verify security middleware headers, Content-Security-Policy directives, CORS origins, rate limiting, and sensitive data logging. Refer to `references/headers-csp-cors.md`.
6. **Supply Chain Check**: Inspect package dependencies for vulnerabilities, insecure versions, and lockfile anomalies. Refer to `references/supply-chain.md`.
7. **Severity Classification**: Assess findings against `references/severity-rubric.md` (CRITICAL, HIGH, MEDIUM, LOW, INFO).
8. **Human Review Escalation**: Label auth/crypto design, payment handling, and privacy/regulatory decisions as REQUIRES HUMAN REVIEW regardless of code correctness.
9. **Report Generation**: Format findings with severity, file:line reference, risk explanation, and remediation code diff.

## Validation
- Every finding cites a valid file path and line number reference.
- Findings are mapped to standard OWASP / ASVS categories.
- Exploit proof of concepts are strictly limited to minimal local tests against the target workspace.

## Failure handling
- If project context is missing, invoke `core-repo-discovery` to inspect project configuration.
- If CRITICAL severity flaws are discovered, mark security validation as FAILED in handoff and notify orchestrator.

## Approval touchpoints
- Refer to `references/approval-levels.md`.
- `LOW`: Code review, static analysis, and local unit safety verification. Fully autonomous.
- `HIGH`: Dynamic security scanning against non-localhost target environments.

## Output
- Written handoff report in `.agent/context/handoffs/NN-security-secure-coding.md` adhering to `references/output-contract.md`.
- Findings summary detailing category, severity, location, impact, and fix.

## References index
- `references/owasp-top10-checklist.md`: OWASP Top 10 checklist and mapping.
- `references/injection.md`: Injection defense guidelines (SQL, command, NoSQL).
- `references/xss-csrf.md`: Cross-Site Scripting and Cross-Site Request Forgery defenses.
- `references/ssrf-path-traversal.md`: SSRF and path traversal prevention rules.
- `references/headers-csp-cors.md`: Security headers, CSP, CORS, rate limiting, and logging.
- `references/supply-chain.md`: Dependency security and lockfile inspection.
- `references/severity-rubric.md`: Vulnerability severity evaluation rubric.
- `references/context-contract.md`: Schema for project context.
- `references/output-contract.md`: Standard handoff output format.
- `references/approval-levels.md`: Operational risk levels.
- `references/untrusted-content.md`: Untrusted content handling rules.
