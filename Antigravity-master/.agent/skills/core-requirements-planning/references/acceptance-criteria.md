# Acceptance Criteria Guidelines (Given/When/Then)

Every requirement must have verifiable acceptance criteria written in Given/When/Then format.

## Given / When / Then Standard Format

```markdown
### Feature: User Password Reset

**Scenario 1: Successful password reset request**
- **Given** an authenticated or unauthenticated user on the password reset page
- **When** the user submits a valid registered email address
- **Then** a reset token email is dispatched and a generic confirmation message is displayed (preventing account enumeration).

**Scenario 2: Invalid email address handling**
- **Given** a user on the password reset page
- **When** the user submits an invalid or unregistered email
- **Then** the same generic confirmation message is displayed without revealing user existence.
```

## Rules for Testable Criteria
- Every **Then** assertion must be empirically verifiable via an automated test or specific HTTP status code / file state.
- Avoid vague statements like "The page should look good" or "System should be fast". Use explicit numbers (e.g. "Response time < 200ms").
