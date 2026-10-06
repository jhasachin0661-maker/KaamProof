# MongoDB Guidelines

## Best Practices
- Model 1-to-few relationships using embedded documents.
- Model 1-to-many or high-cardinality relationships using reference ObjectIds.
- Enforce schema validation rules using `$jsonSchema`.
