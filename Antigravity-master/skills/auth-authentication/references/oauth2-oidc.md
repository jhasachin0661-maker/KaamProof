# OAuth2 & OpenID Connect (OIDC) Guidelines

## Security Requirements
- **PKCE (Proof Key for Code Exchange)**: Mandatory for all single-page (SPA) and mobile applications to prevent authorization code interception.
- **State Parameter**: Generate cryptographic high-entropy `state` parameter to prevent CSRF attacks on OAuth redirect callbacks.
- **Nonce Verification**: Verify `nonce` parameter in OIDC ID tokens.
