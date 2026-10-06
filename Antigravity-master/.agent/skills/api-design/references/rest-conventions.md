# RESTful API Conventions

## Resource URI Naming
- Use plural nouns for resource endpoints: `/api/v1/users`, `/api/v1/orders`.
- Use HTTP verbs according to semantics:
  - `GET`: Retrieve resource.
  - `POST`: Create resource.
  - `PUT`: Replace resource.
  - `PATCH`: Partially update resource.
  - `DELETE`: Remove resource.

## Standard Error Response Structure
```json
{
  "error": {
    "code": "INVALID_INPUT",
    "message": "The request body failed schema validation.",
    "details": [
      { "field": "email", "issue": "Must be a valid email address." }
    ]
  }
}
```
