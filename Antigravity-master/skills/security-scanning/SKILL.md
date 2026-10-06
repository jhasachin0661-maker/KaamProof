---
name: security-scanning
description: Run and triage defensive security scans including SAST, dependency SCA, secret detection, container scanning, and DAST using semgrep, npm audit, pip-audit, gitleaks, or trivy. Trigger whenever auditing code security, triaging scan findings, scanning secrets, or running DAST against localhost, even if security scanning is not named.
metadata:
  category: security
  priority: P1
  layer: verify
  version: 0.1.0
  reads_from: core-repo-discovery, core-dependency-management
  risk_max: HIGH
---

# Security Scanning

## Purpose
Execute defensive security scanning across codebases (SAST), dependencies (SCA), secrets detection, container images, and dynamic application security testing (DAST). Triage findings into actionable remediation steps while adhering to strict defensive boundaries and target ownership confirmation rules.

## When NOT to use
- Do not run DAST or active network scanning against third-party or non-localhost targets without explicit user confirmation of target ownership (`HIGH` risk).
- Do not attempt offensive exploit development or unauthorized penetration testing.

## Inputs
- Codebase files, container images (`Dockerfile`), dependency manifests, `.agent/context/project-context.json`.

## Procedure
1. **Tool Selection**:
   - Detect locally available security tools (Semgrep, npm audit, pip-audit, cargo audit, Gitleaks, Trivy). Refer to `references/tools.md`.
2. **SAST & Secret Scanning**:
   - Run static code analysis (SAST) with `semgrep` to detect OWASP vulnerabilities.
   - Run secret detection with `gitleaks` to find committed API keys, tokens, or private keys.
3. **Dependency (SCA) & Container Scanning**:
   - Audit dependencies using ecosystem audit tools (`npm audit`, `pip-audit`, `trivy fs .`).
   - Audit Docker images using `trivy image <image-name>`.
4. **DAST Safety Controls**:
   - Run DAST scans ONLY against `localhost` or target URLs explicitly confirmed by the human user. Refer to `references/dast-safety.md`. Scans against external targets are `HIGH` risk and require explicit human permission.
5. **Triage & Remediation**:
   - Classify findings into Critical, High, Medium, Low severities following `references/triage-guide.md`.
   - Filter false positives with documented evidence. Formulate code/dependency fixes for true positives.

## Validation
- SAST and secret scan commands executed cleanly.
- Scan findings triaged with clear severity classification and file:line evidence.
- DAST safety rules strictly honored with 0 unauthorized external scans.

## Failure handling
- If security scanning tool is missing on host, report missing tool gracefully, fall back to regex secret pattern matching and lockfile inspection, and document tool installation recommendation.

## Approval touchpoints
- Refer to `references/approval-levels.md`.
- `LOW`: Passive SAST scans, dependency audits, secret scans, localhost scans.
- `HIGH`: Active DAST scans targeting non-localhost endpoints or staging environments. Requires explicit human user confirmation.

## Output
- Handoff file in `.agent/context/handoffs/NN-security-scanning.md` per `references/output-contract.md`.
- Security Audit Report detailing SAST/SCA/Secret/DAST findings, triage notes, and remediations.

## References index
- `references/tools.md`: Security tools catalog (semgrep, gitleaks, trivy, npm/pip-audit).
- `references/triage-guide.md`: Vulnerability triage, severity matrix, and remediation guidelines.
- `references/dast-safety.md`: DAST safety protocol, target ownership verification, and localhost rules.
- `references/context-contract.md`: Schema for project context.
- `references/output-contract.md`: Standard handoff output structure.
- `references/approval-levels.md`: Risk levels and escalation rules.
- `references/untrusted-content.md`: Untrusted content and anti-tamper safety rules.
