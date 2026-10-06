# OpenAPI Specification Guidelines

## Version Check Requirement
Check OpenAPI version header (`openapi: 3.0.3` vs `openapi: 3.1.0`).
- OpenAPI 3.1 supports full JSON Schema draft 2020-12 alignment and `type: [string, "null"]`.

## Best Practices
- Define reusable schemas under `components/schemas`.
- Declare security schemes under `components/securitySchemes` (e.g., `bearerAuth`, `apiKey`).
- Explicitly attach `security` fields to each path operation.
