# Data Warehousing Architecture

## Dimensional Modeling (Kimball Methodology)
Organize data warehouse schema into Fact and Dimension tables for optimal analytics performance.

### Star Schema Design
- **Fact Tables**: Store numerical metrics and events (e.g., `fact_sales`, `fact_pageviews`). High cardinality, narrow rows.
- **Dimension Tables**: Store contextual attributes (e.g., `dim_customers`, `dim_products`, `dim_date`). Low cardinality, wide rows.

```
      +------------------+
      |  dim_customers   |
      +------------------+
               | 1
               |
               | N
      +------------------+         +------------------+
      |    fact_sales    |--------N|   dim_products   |
      +------------------+ 1       +------------------+
               | N
               |
               | 1
      +------------------+
      |     dim_date     |
      +------------------+
```

## Slowly Changing Dimensions (SCD)
- **SCD Type 1 (Overwrite)**: Update attribute directly. No historical record kept.
- **SCD Type 2 (Add New Row)**: Maintain history by adding a new record with `valid_from`, `valid_to`, and `is_current` flags.
- **SCD Type 3 (Add New Column)**: Keep previous value in a dedicated column (e.g., `previous_address`).

## Storage Formats
- **Parquet**: Columnar format with dictionary encoding and snappy/zstd compression. Ideal for OLAP.
- **Iceberg / Delta Lake**: Open table formats providing ACID transactions, time travel, and schema evolution over cloud object storage.
