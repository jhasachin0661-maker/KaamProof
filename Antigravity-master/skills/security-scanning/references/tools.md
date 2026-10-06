# Security Scanning Tools Guide

## 1. SAST (Static Application Security Testing)
- **semgrep**: `semgrep --config p/ci .` (scans for OWASP top 10 vulnerabilities in code).

## 2. Secret Detection
- **gitleaks**: `gitleaks detect --verbose` (scans git history and working directory for hardcoded secrets, keys, and tokens).

## 3. SCA (Software Composition Analysis)
- **npm audit**: `npm audit --json`
- **pip-audit**: `pip-audit --format json`
- **trivy fs**: `trivy fs --severity HIGH,CRITICAL .`

## 4. Container Vulnerability Scanning
- **trivy image**: `trivy image <image_name>`

## 5. DAST (Dynamic Application Security Testing)
- **OWASP ZAP / Nuclei**: Executed ONLY against `http://localhost:*` or explicitly user-confirmed targets.
