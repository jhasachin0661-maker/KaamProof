# Pagination, Filtering & Sorting Standards

## Cursor-Based Pagination
- Query parameters: `limit=20`, `starting_after=obj_123` or `cursor=eyJpZCI6MTIzfQ==`.
- Response structure:
```json
{
  "data": [...],
  "has_more": true,
  "next_cursor": "eyJpZCI6MTQzfQ=="
}
```

## Filtering & Sorting
- Use explicit field query parameters: `status=active&created_after=2026-01-01`.
- Sorting parameters: `sort=-created_at,name` (prefix `-` indicates descending order).
