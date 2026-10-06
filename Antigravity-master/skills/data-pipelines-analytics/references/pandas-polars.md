# Data Processing: Pandas vs Polars

## Library Comparison
| Feature | Pandas | Polars |
|---------|--------|--------|
| Execution Engine | Single-threaded Python | Multi-threaded Rust |
| Memory Efficiency | High memory overhead (copies) | Zero-copy Arrow memory format |
| Lazy Evaluation | No (eager only) | Yes (LazyFrame query optimization) |
| Best For | Legacy codebases, small data (<1GB) | Large datasets (>1GB), high performance pipelines |

## Pandas Data Cleaning Snippets
```python
import pandas as pd

# Load data with schema enforcement
df = pd.read_csv("data.csv", dtype={"user_id": "string", "amount": "float64"})

# Handle missing values
df["amount"] = df["amount"].fillna(0.0)
df.dropna(subset=["user_id"], inplace=True)

# Parse dates safely
df["created_at"] = pd.to_datetime(df["created_at"], errors="coerce")

# Vectorized transformations
df["total_tax"] = df["amount"] * 0.15
```

## Polars Data Processing Snippets
```python
import polars as pl

# Lazy evaluation for memory efficiency
q = (
    pl.scan_csv("data.csv")
    .filter(pl.col("amount") > 0)
    .with_columns(
        pl.col("created_at").str.to_datetime(),
        (pl.col("amount") * 0.15).alias("total_tax")
    )
    .group_by("category")
    .agg(
        pl.col("amount").sum().alias("total_sales"),
        pl.col("user_id").count().alias("transaction_count")
    )
)

# Execute plan
df = q.collect()
```
