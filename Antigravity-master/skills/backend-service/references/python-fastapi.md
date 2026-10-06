# Python FastAPI Guidelines

## Version Check Requirement
Check Pydantic and FastAPI versions in `requirements.txt` / `pyproject.toml`:
- **Pydantic v1 vs v2**: Pydantic v2 uses `model_config`, `@field_validator`, and `BaseModel.model_dump()` instead of `dict()`.

## Best Practices
- Use async route handlers (`async def`) for I/O-bound endpoints.
- Define explicit request bodies using Pydantic schemas.
- Use `Depends()` for dependency injection (database sessions, authentication guards).
