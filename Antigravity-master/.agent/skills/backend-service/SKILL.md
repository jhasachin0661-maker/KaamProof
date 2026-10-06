---
name: backend-service
description: Build backend microservices and monolith application servers in Node or Python. Trigger whenever writing server logic, Express, Fastify, NestJS, FastAPI, Django controllers, queues, WebSockets, or background jobs, even if backend is not explicitly named. Enforces version checks, boundary validation, and secret masking in logs.
metadata:
  category: backend
  priority: P1
  layer: build
  version: 0.1.0
  reads_from: core-repo-discovery, api-design, database-design
  risk_max: MEDIUM
---

# Backend Service

## Purpose
Build scalable, secure backend microservices and monolith application servers across Node (Express, Fastify, NestJS) and Python (FastAPI, Django) stacks. Enforces version verification, boundary input validation, structured logging, secret protection, rate limiting, and background job handling.

## When NOT to use
- Do not use for frontend UI component rendering or static website styling.
- Do not execute raw database schema migrations directly without using `database-migrations-orm`.

## Inputs
- Project dependencies (`package.json`, `pyproject.toml`, `requirements.txt`), controller routes, and `.agent/context/project-context.json`.

## Procedure
1. **Version Check**: Inspect framework/runtime version from package manifests (Express v4 vs v5, NestJS v9 vs v10, FastAPI vs Pydantic v1 vs v2, Django v4 vs v5). Verify version-sensitive APIs against official documentation or `core-research`.
2. **Framework & Architecture Selection**: Follow clean layered architecture (routes -> controllers -> services -> data access). Consult `references/node.md`, `references/python-fastapi.md`, and `references/django.md`.
3. **Boundary Input Validation**: Validate incoming payloads at HTTP controllers using schemas (Zod, Pydantic, class-validator) before passing data to service layers.
4. **Error Handling & Structured Logging**: Implement centralized error handling middleware and structured JSON logging. Mask passwords, tokens, and PII. Refer to `references/error-handling-logging.md`.
5. **Background Jobs, Queues & Cron**: Offload heavy operations to background queues (BullMQ, Celery, Redis). Refer to `references/jobs-queues.md`.
6. **Real-time WebSockets & Webhooks**: Structure WebSocket handlers and verify incoming webhook signatures. Refer to `references/websockets.md` and `references/payments-email-uploads.md`.
7. **Security Guardrails**:
   - Use parameterized queries or ORM interfaces for database interactions.
   - Apply rate limiters on public and authentication routes.
   - **Payment Flow Escalation**: Payment gateways and financial transaction logic carry `CRITICAL` risk and MUST be tagged with REQUIRES HUMAN REVIEW.
8. **Empirical Validation**: Execute backend unit tests, build commands, and typecheck verification.

## Validation
- Framework version checked in package manifests prior to code modifications.
- Boundary validation enforced on all incoming HTTP request handlers.
- Build and test suite commands exit code 0 verified.

## Failure handling
- If backend service crashes on startup, capture startup logs, inspect environment variables, and route to `core-debugging`.

## Approval touchpoints
- Refer to `references/approval-levels.md`.
- `LOW`: Modifying internal business logic, adding controller routes, local unit testing.
- `MEDIUM`: Adding new background queues, changing middleware stack.
- `CRITICAL`: Payment integration changes or financial transaction flow modifications.

## Output
- Handoff file in `.agent/context/handoffs/NN-backend-service.md` per `references/output-contract.md`.
- Summary of updated controller endpoints, service layers, and test execution exit codes.

## References index
- `references/node.md`: Node.js backend frameworks (Express, Fastify, NestJS).
- `references/python-fastapi.md`: Python FastAPI patterns, Pydantic v2 validation, and async handlers.
- `references/django.md`: Django REST Framework and service layer patterns.
- `references/jobs-queues.md`: Background job queues, worker processes, and cron scheduling.
- `references/websockets.md`: WebSocket handlers, connection pooling, and pub/sub messaging.
- `references/error-handling-logging.md`: Structured logging, secret masking, and error models.
- `references/payments-email-uploads.md`: Payment integrations, email notifications, file uploads, and human review gating.
- `references/context-contract.md`: Schema for project context.
- `references/output-contract.md`: Standard handoff output structure.
- `references/approval-levels.md`: Operational risk levels.
- `references/untrusted-content.md`: Untrusted content handling rules.
