---
name: api-design
description: Design REST, GraphQL, and OpenAPI contracts and API interfaces. Trigger whenever designing endpoints, request/response schemas, API contracts, pagination, filtering, webhooks, or API documentation, even if api-design is not explicitly named. Enforces version checks, breaking change detection, and auth requirement definitions.
metadata:
  category: api
  priority: P1
  layer: build
  version: 0.1.0
  reads_from: core-requirements-planning
  risk_max: LOW
---

# API Design

## Purpose
Design robust, consistent REST, GraphQL, and OpenAPI specifications. Enforces version verification, breaking change detection, explicit authentication requirement definitions for every endpoint, pagination standards, idempotency, resilience, and webhook contract structures.

## When NOT to use
- Do not use for writing database schema migrations directly.
- Do not use for implementing frontend component UI layouts.

## Inputs
- OpenAPI specs, GraphQL schemas, route definitions, and `.agent/context/project-context.json`.

## Procedure
1. **Version Check**: Read OpenAPI specification version (OpenAPI 3.0 vs 3.1) or GraphQL schema tooling versions from repository context before editing contracts. Verify version-sensitive spec fields against official documentation or `core-research`.
2. **REST Contract Conventions**: Design resource-oriented HTTP routes, status codes (`200`, `201`, `204`, `400`, `401`, `403`, `404`, `409`, `422`, `500`), and JSON payload structures. Refer to `references/rest-conventions.md`.
3. **GraphQL Schema Design**: Define types, queries, mutations, subscriptions, input types, and field deprecation directives. Refer to `references/graphql.md`.
4. **OpenAPI Specification**: Structure `openapi.yaml` / `openapi.json` schemas with reusable components, parameters, and responses. Refer to `references/openapi.md`.
5. **Pagination, Filtering & Sorting**: Enforce cursor-based or offset-based pagination models and query parameter standards. Refer to `references/pagination-filtering.md`.
6. **Resilience & Rate Limiting**: Define client retry rules, idempotency headers (`Idempotency-Key`), rate limiting limits (`X-RateLimit-Limit`), timeouts, and circuit breaker expectations. Refer to `references/resilience.md`.
7. **Webhook Event Definitions**: Structure payload formats, event naming (`resource.action`), and HMAC signature headers for outbound webhooks. Refer to `references/webhooks.md`.
8. **Breaking Change & Auth Rules**:
   - Explicitly define authentication and authorization requirements for EVERY endpoint (Public, Authenticated, Admin, Scope required).
   - Detect breaking API contract changes (removing fields, changing field types, altering response codes) and require API path/header versioning (`/v1`, `/v2`).

## Validation
- OpenAPI or GraphQL schema lint command exits clean (exit code 0).
- Every endpoint explicitly declares its authentication requirement.
- Breaking changes trigger explicit API versioning requirements.

## Failure handling
- If API schema linter reports breaking changes without version bump, flag breaking change violation and block schema completion.

## Approval touchpoints
- Refer to `references/approval-levels.md`.
- `LOW`: Designing API contracts, updating OpenAPI specifications, adding endpoints. Autonomous.

## Output
- Handoff file in `.agent/context/handoffs/NN-api-design.md` per `references/output-contract.md`.
- Updated OpenAPI spec, GraphQL schema, or API contract documentation.

## References index
- `references/rest-conventions.md`: RESTful route conventions, HTTP verbs, and status codes.
- `references/graphql.md`: GraphQL schema design, types, mutations, and pagination.
- `references/openapi.md`: OpenAPI 3.0 / 3.1 schema specification guidelines.
- `references/pagination-filtering.md`: Cursor-based and offset pagination, sorting, and filtering.
- `references/resilience.md`: Idempotency, rate limiting, retries, timeouts, and circuit breakers.
- `references/webhooks.md`: Webhook payload format, signature verification, and delivery contracts.
- `references/context-contract.md`: Schema for project context.
- `references/output-contract.md`: Standard handoff output structure.
- `references/approval-levels.md`: Operational risk levels.
- `references/untrusted-content.md`: Untrusted content handling rules.
