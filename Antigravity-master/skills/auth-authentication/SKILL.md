---
name: auth-authentication
description: Implement authentication systems, login flows, session management, OAuth2, OpenID Connect, and password security. Trigger whenever implementing login, auth, JWT, cookies, MFA, OAuth, or user registration, even if auth is not explicitly named. Enforces vetted providers, threat documentation, and human review gating.
metadata:
  category: auth
  priority: P1
  layer: build
  version: 0.1.0
  reads_from: config-env-secrets, security-secure-coding
  risk_max: CRITICAL
---

# Auth Authentication

## Purpose
Implement secure user authentication, identity verification, OAuth2/OIDC integration, session management, password hashing, Multi-Factor Authentication (MFA), email verification, and account recovery. Enforces vetted authentication libraries, environment secret hygiene, threat modeling documentation, and human review gating.

## When NOT to use
- Do not use for role-based authorization check logic (use `auth-authorization`).
- Do not invent custom, hand-rolled cryptographic algorithms or custom password hashing routines.

## Inputs
- Auth provider configuration, session store settings, environment variables, and `.agent/context/project-context.json`.

## Procedure
1. **Version & Provider Selection**: Check package manifests for vetted authentication providers (Auth.js / NextAuth, Clerk, Supabase Auth, Firebase Auth). Avoid custom auth engines when vetted providers exist. Consult `references/provider-notes.md`.
2. **Session & Cookie Security**: Configure session tokens with `HttpOnly`, `Secure`, and `SameSite=Lax` or `SameSite=Strict` cookie flags. Refer to `references/sessions-cookies.md`.
3. **JWT & Refresh Tokens**: Implement short-lived JWT access tokens paired with secure, rotatable refresh tokens stored in HTTP-only cookies. Refer to `references/jwt-refresh.md`.
4. **OAuth2 & OpenID Connect (OIDC)**: Configure PKCE (Proof Key for Code Exchange) flow for single-page and mobile apps. Refer to `references/oauth2-oidc.md`.
5. **Passwords & MFA**: Use industry-standard password hashing (bcrypt, Argon2, PBKDF2 with salt). Require TOTP/SMS/Email MFA for sensitive accounts. Refer to `references/passwords-mfa.md`.
6. **Recovery & Verification**: Structure secure email verification and rate-limited password reset tokens. Refer to `references/recovery-verification.md`.
7. **Secret Hygiene**: Read all API keys, client secrets, and private keys strictly from environment variables. Never commit secrets.
8. **Threat Analysis & Human Review Gating**:
   - Every completed authentication design MUST include a `Threat Notes` section documenting risk mitigations. Refer to `references/threats.md`.
   - Every final authentication implementation carries `REQUIRES HUMAN REVIEW` status.
   - Any credential change, secret key rotation, or auth architecture modification carries `CRITICAL` risk.

## Validation
- Vetted auth provider or established library utilized (zero hand-rolled crypto).
- Cookies explicitly configured with `HttpOnly`, `Secure`, and `SameSite` flags.
- Handoff contains mandatory `Threat Notes` section and carries `REQUIRES HUMAN REVIEW` label.

## Failure handling
- If auth provider initialization fails, capture provider error codes, inspect environment secret declarations, and route to `core-debugging`.

## Approval touchpoints
- Refer to `references/approval-levels.md`.
- `LOW` / `MEDIUM`: Reading auth context, adding local middleware guards.
- `CRITICAL`: Modifying authentication architecture, changing credentials, altering token secrets, or editing identity schemas. Requires explicit human authorization.

## Output
- Handoff file in `.agent/context/handoffs/NN-auth-authentication.md` per `references/output-contract.md` containing `Threat Notes` and `REQUIRES HUMAN REVIEW` status.
- Implemented auth controllers, middleware, and provider configuration files.

## References index
- `references/sessions-cookies.md`: Session storage, cookie attributes (HttpOnly, Secure, SameSite).
- `references/jwt-refresh.md`: JWT access tokens, refresh token rotation, and revocation.
- `references/oauth2-oidc.md`: OAuth2 grant types, OIDC, state parameters, and PKCE flow.
- `references/passwords-mfa.md`: Password hashing standards (Argon2, bcrypt) and MFA TOTP flows.
- `references/recovery-verification.md`: Secure account recovery, email verification, and token expiration.
- `references/provider-notes.md`: Guidelines for Auth.js, Clerk, Supabase Auth, and Firebase Auth.
- `references/threats.md`: Threat modeling checklist for authentication flows.
- `references/context-contract.md`: Schema for project context.
- `references/output-contract.md`: Standard handoff output structure.
- `references/approval-levels.md`: Operational risk levels.
- `references/untrusted-content.md`: Untrusted content handling rules.
