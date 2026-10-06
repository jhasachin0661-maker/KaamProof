# Pytest Testing Patterns

## Setup & Configuration
- Config in `pyproject.toml` under `[tool.pytest.ini_options]` or `pytest.ini`.
- Use `conftest.py` for shared fixtures.

## Writing Unit Tests

```python
import pytest
from app.services.calculator import calculate_total

class TestCalculateTotal:
    def test_empty_list_returns_zero(self):
        assert calculate_total([]) == 0

    def test_sums_prices_with_quantities(self):
        items = [{"price": 10, "quantity": 2}, {"price": 5, "quantity": 3}]
        assert calculate_total(items) == 35

    @pytest.mark.parametrize("price,qty,expected", [
        (0.1, 3, 0.3),
        (100, 0, 0),
    ])
    def test_edge_cases(self, price, qty, expected):
        items = [{"price": price, "quantity": qty}]
        assert calculate_total(items) == pytest.approx(expected)
```

## Fixtures & Database Isolation

```python
@pytest.fixture
def db_session(tmp_path):
    """Create isolated test database session."""
    engine = create_engine(f"sqlite:///{tmp_path}/test.db")
    Base.metadata.create_all(engine)
    session = Session(engine)
    yield session
    session.close()
```

## Conventions
- File naming: `test_*.py` or `*_test.py`.
- Use `pytest.raises(ExceptionType)` for error assertions.
- Run: `pytest -v --tb=short` or `pytest --cov=app`.
