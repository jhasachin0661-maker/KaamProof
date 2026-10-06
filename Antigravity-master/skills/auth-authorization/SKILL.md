---
name: auth-authorization
description: Implement server-side authorization, RBAC, ABAC, ownership validation (IDOR/BOLA prevention), multi-tenant isolation, API key scopes, and service accounts. Trigger whenever implementing permission checks, access control rules, tenant boundary enforcement, or guarding endpoints, even if authorization is not named.
metadata:
  category: auth
  priority: P1
  layer: build
  version: 0.1.0
  reads_from: auth-authentication, database-design
  risk_max: HIGH
---

# Auth Authorization

## Purpose
Build robust, secure server-side authorization controls using Role-Based Access Control (RBAC), Attribute-Based Access Control (ABAC), strict resource ownership validation (preventing IDOR/BOLA), multi-tenancy data isolation, API key scoping, and service account governance. Enforce a strict "Deny by Default" posture where every request is evaluated server-side before executing operations. All authorization designs require human security review (`REQUIRES HUMAN REVIEW`).

## When NOT to use
- Do not use for user identity authentication, login flows, or JWT token issuance alone (use `auth-authentication`).
- Do not use for general database schema design without authorization rules (use `database-design`).

## Inputs
- Backend controllers, API route handlers, database schema, `.agent/context/project-context.json`.

## Procedure
1. **Deny-by-Default Policy**:
   - Enforce server-side authorization checks on *every* request, handler, and database query. Never rely on client-side UI visibility or hidden parameters.
2. **Access Control Model Selection**:
   - Apply RBAC (roles, permissions, role hierarchy) or ABAC (user attributes, resource attributes, environmental context) using `references/rbac-abac.md`.
3. **IDOR & BOLA Prevention**:
   - Enforce resource-level ownership validation on every database lookup using `references/idor-bola.md`. Ensure user identity/tenant ID from verified session is included in SQL/ORM `WHERE` clauses (e.g. `WHERE id = :resource_id AND tenant_id = :tenant_id`).
4. **Multi-Tenancy Isolation**:
   - Implement strict tenant boundaries per `references/multi-tenancy.md`. Isolate tenant data using schema-per-tenant or column-level tenant scoping with automated middleware row-level security.
5. **API Keys & Service Accounts**:
   - Define least-privilege scope-based permission checks for programmatic service accounts and external API keys using `references/api-keys-service-accounts.md`.
6. **Empirical Validation**:
   - Run unit and integration tests verifying unauthorized requests return `401 Unauthorized` or `403 Forbidden` exit codes.

## Validation
- Authorization tests verify unauthorized access returns HTTP 403 / 401 across all protected routes.
- IDOR/BOLA test suite attempts cross-tenant resource access and verifies denial.
- Authorization architecture labelled with `REQUIRES HUMAN REVIEW`.

## Failure handling
- If authorization middleware leaks access or fails closed test, revert changes (`git checkout`), isolate failing route, apply fallback `403 Forbidden` response, and route to `security-secure-coding`.

## Approval touchpoints
- Refer to `references/approval-levels.md`.
- `HIGH`: Modifying access control middleware, changing RBAC/ABAC rules, updating tenant isolation logic. Requires human review confirmation.

## Output
- Handoff file in `.agent/context/handoffs/NN-auth-authorization.md` per `references/output-contract.md`.
- Authorization design document marked with `REQUIRES HUMAN REVIEW` status tag.

## References index
- `references/rbac-abac.md`: Design patterns for Role-Based Access Control and Attribute-Based Access Control.
- `references/idor-bola.md`: Preventing Insecure Direct Object References and Broken Object Level Authorization.
- `references/multi-tenancy.md`: Multi-tenant data isolation and context propagation strategies.
- `references/api-keys-service-accounts.md`: API key scoping, service account authentication, and rate limiting.
- `references/context-contract.md`: Schema for project context.
- `references/output-contract.md`: Standard handoff output structure.
- `references/approval-levels.md`: Risk levels and escalation rules.
- `references/untrusted-content.md`: Untrusted content and anti-tamper safety rules.
