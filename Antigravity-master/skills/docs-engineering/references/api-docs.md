# API Reference Structure

## Endpoint Template

### `POST /api/v1/resource`
[Short description of operation]

#### Authentication
- Type: Bearer Token / API Key
- Header: `Authorization: Bearer <token>`

#### Request Body
```json
{
  "name": "string (required)",
  "count": "integer (optional, default: 1)"
}
```

#### Responses
- **201 Created**: Resource successfully created.
```json
{
  "id": "res_123",
  "name": "example",
  "createdAt": "2026-10-03T00:00:00Z"
}
```
- **400 Bad Request**: Invalid body parameters.
- **401 Unauthorized**: Missing or invalid token.
- **403 Forbidden**: Insufficient scope or tenant mismatch.
