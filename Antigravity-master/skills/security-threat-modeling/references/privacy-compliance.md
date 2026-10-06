# Privacy & Compliance Reference

> [!NOTE]
> **LEGAL DISCLAIMER**: Technical information, compliance checklists, and privacy guidelines provided in this document are for software architectural reference only and **DO NOT CONSTITUTE FORMAL LEGAL ADVICE**. Consult qualified legal counsel for binding compliance guidance.

## Key Privacy Engineering Patterns

### 1. Data Minimization (GDPR Art. 5)
- Store only PII data fields strictly necessary for stated application functionality.
- Implement data retention policies with automated soft/hard deletion.

### 2. Right to be Forgotten (GDPR Art. 17)
- Provide user account deletion workflows that purge PII across databases, backups, and analytics stores.

### 3. Cookie Consent & Analytics
- Require explicit opt-in consent before initializing non-essential tracking cookies or analytics SDKs.
