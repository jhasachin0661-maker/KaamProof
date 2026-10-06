# ETL / ELT Architecture Patterns

## ETL vs ELT
| Feature | ETL (Extract, Transform, Load) | ELT (Extract, Load, Transform) |
|---------|--------------------------------|--------------------------------|
| Transformation | In-memory/staging before load | In cloud data warehouse after load |
| Best For | Sensitive data (masking), legacy systems, complex row logic | Modern cloud warehouses (Snowflake, BigQuery, DuckDB, Postgres) |
| Scalability | Limited by worker compute | Scales with warehouse compute |
| Raw Data | Usually discarded or archived | Preserved in data lake/warehouse raw schema |

## Idempotent Pipeline Design
Pipelines MUST be rerun-safe without creating duplicate records or corrupting data.
- **Partition Overwrites**: Overwrite daily/hourly partitions rather than appending (`INSERT OVERWRITE` or deletion of target date range before insert).
- **Upsert / Merge**: Use primary key keys for deduplication (`MERGE INTO target USING staging ON target.id = staging.id`).
- **Deterministic Key Generation**: Generate surrogate keys using hashing (`MD5(CONCAT(tenant_id, '-', source_id))`).

## Batch vs Streaming Processing
- **Batch Processing**: Run on a schedule (cron, Airflow, Prefect). Suitable for daily reporting, financial reconciliation, and heavy aggregations.
- **Streaming Processing**: Real-time message consumption (Kafka, RabbitMQ, Redpanda). Suitable for fraud detection, live metrics, and real-time operational alerts.
