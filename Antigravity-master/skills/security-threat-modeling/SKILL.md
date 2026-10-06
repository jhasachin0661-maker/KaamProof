---
name: security-threat-modeling
description: STRIDE, data-flow diagrams, attack-surface analysis at design time; privacy/compliance notes (GDPR, cookie consent) clearly labeled as NOT legal advice. Trigger whenever conducting threat modeling, analyzing attack surface, evaluating architectural risks, or assessing privacy compliance, even if threat modeling is not named.
metadata:
  category: security
  priority: P2
  layer: understand
  version: 0.1.0
  reads_from: arch-system-design
  risk_max: LOW
---

# Security Threat Modeling

## Purpose
Perform threat modeling at design time using the STRIDE methodology (Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege), construct Data Flow Diagrams (DFDs), analyze attack surfaces, and specify architectural security mitigations. Evaluate privacy/compliance considerations (GDPR, cookie consent), explicitly tagging all compliance notes with a disclaimer that they do NOT constitute legal advice.

## When NOT to use
- Do not use for automated SAST vulnerability scanning or static secret detection (use `security-scanning`).
- Do not use for implementing server-side authentication/authorization code (use `auth-authentication` or `auth-authorization`).

## Inputs
- Architecture diagrams, system design documents from `arch-system-design`, data flow specifications, `.agent/context/project-context.json`.

## Procedure
1. **Data Flow Diagramming (DFD)**:
   - Map processes, data stores, external entities, and data flows. Define trust boundaries per `references/attack-surface.md`.
2. **STRIDE Threat Analysis**:
   - Evaluate threats across trust boundaries using STRIDE categories per `references/stride.md`.
3. **Mitigation & Security Controls Specification**:
   - Map identified threats to architectural controls (encryption at rest/in transit, TLS 1.3, MFA, RBAC, input sanitization).
4. **Privacy & Compliance Audit**:
   - Assess GDPR data minimisation, right-to-be-forgotten, and cookie consent rules per `references/privacy-compliance.md`.
   - **MANDATORY LEGAL DISCLAIMER**: Include explicit header: `> [!NOTE]\n> **Disclaimer**: Privacy and compliance information provided herein is for technical architectural reference only and DOES NOT CONSTITUTE LEGAL ADVICE.`

## Validation
- DFD constructed with trust boundaries explicitly identified.
- STRIDE analysis covers all 6 threat categories with corresponding mitigations.
- Compliance/privacy section carries mandatory "NOT LEGAL ADVICE" disclaimer.

## Failure handling
- If threat mitigation requires breaking architectural changes, document the threat vector, tag as unresolved risk, and propose lower-friction technical controls.

## Approval touchpoints
- Refer to `references/approval-levels.md`.
- `LOW`: Threat modeling analysis, architectural security assessment, compliance reference drafting.

## Output
- Handoff file in `.agent/context/handoffs/NN-security-threat-modeling.md` per `references/output-contract.md`.
- Threat Model document containing DFD, STRIDE matrix, mitigations, and compliance references.

## References index
- `references/stride.md`: STRIDE threat modeling categories, attack vectors, and mitigations.
- `references/attack-surface.md`: Data Flow Diagrams (DFD), trust boundaries, and attack surface reduction.
- `references/privacy-compliance.md`: Technical privacy patterns (GDPR, cookie consent) and mandatory legal disclaimer.
- `references/context-contract.md`: Schema for project context.
- `references/output-contract.md`: Standard handoff output structure.
- `references/approval-levels.md`: Operational risk levels.
- `references/untrusted-content.md`: Untrusted content handling rules.
