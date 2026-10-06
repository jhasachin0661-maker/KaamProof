# STRIDE Threat Modeling Matrix

| Threat Category | Security Property | Description | Standard Technical Mitigation |
|---|---|---|---|
| **S**poofing | Authentication | Impersonating a user, system, or service | Strong MFA, OAuth2/OIDC, mTLS, signed JWTs |
| **T**ampering | Integrity | Modifying data in transit or at rest | HMAC signatures, TLS 1.3, DB checksums, WAF |
| **R**epudiation | Non-repudiation | Denying an action took place | Immutable audit logging, digital signatures |
| **I**nformation Disclosure | Confidentiality | Exposing sensitive data to unauthorized parties | Encryption at rest (AES-256), TLS 1.3, strict RBAC/ABAC |
| **D**enial of Service | Availability | Exhausting resources to disrupt availability | Rate limiting, CDN DDoS protection, auto-scaling |
| **E**levation of Privilege | Authorization | Gaining higher permissions than authorized | Least-privilege IAM, strict server-side authorization checks |
