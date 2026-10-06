# Data Quality and Validation

## Validation Frameworks
Validate data schemas and business invariants BEFORE loading data into production tables.

| Framework | Best For | Description |
|-----------|----------|-------------|
| Great Expectations | Data pipelines & warehousing | Expectation suites defined as code or JSON for automated pipeline validation |
| Pydantic | Python microservices / ingestion | Data validation and settings management using Python type hints |
| Pandera | DataFrames (Pandas/Polars) | Schema validation and assertion testing on DataFrame objects |
| dbt tests | SQL transformations | Generic tests (`unique`, `not_null`, `relationships`, `accepted_values`) in YAML |

## Pandera DataFrame Validation Example
```python
import pandera as pa
from pandera.typing import Series

class SalesSchema(pa.DataFrameModel):
    transaction_id: Series[str] = pa.Field(unique=True, nullable=False)
    user_id: Series[str] = pa.Field(nullable=False)
    amount: Series[float] = pa.Field(ge=0.0)
    status: Series[str] = pa.Field(isin=["completed", "pending", "refunded"])

@pa.check_types
def process_sales(df: pa.typing.DataFrame[SalesSchema]):
    # Function receives validated DataFrame
    return df
```

## Great Expectations Checks
- `expect_column_values_to_not_be_null(column="user_id")`
- `expect_column_values_to_be_between(column="age", min_value=0, max_value=120)`
- `expect_column_values_to_match_regex(column="email", regex=r"^[^@]+@[^@]+\.[^@]+$")`
