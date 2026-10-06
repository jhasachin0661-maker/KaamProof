---
name: data-pipelines-analytics
description: Build ETL/ELT data pipelines, CSV/JSON/API ingestion, cleaning, validation, transformation, warehousing, SQL analytics, Python data processing (pandas, polars), and dashboards. Idempotent pipelines; validate schema at ingestion. Trigger whenever building data pipelines, processing datasets, writing SQL analytics, creating dashboards, or transforming data, even if data-pipelines is not explicitly named.
metadata:
  category: data
  priority: P2
  layer: build
  version: 0.1.0
  reads_from: database-design
  risk_max: MEDIUM
---

# Data Pipelines Analytics

## Purpose
Design and build data pipelines for ingesting, cleaning, validating, transforming, and analyzing data. Cover ETL/ELT patterns, file and API ingestion, schema validation, SQL analytics, Python processing with pandas/polars, and dashboard creation. Pipelines must be idempotent and validate schemas at ingestion to prevent corrupt data propagation.

## When NOT to use
- Do not use for database schema design without pipeline logic (use `database-design`).
- Do not use for ML model training (use `ai-vision-ml`).
- Do not use for frontend dashboard components without data processing (use `frontend-web-app`).

## Inputs
- Data sources (files, APIs, databases), schema definitions, transformation logic, `.agent/context/project-context.json`.

## Procedure
1. **Ingestion**: Load data from CSV, JSON, Parquet, APIs, or databases. Validate schemas at ingestion per `references/data-validation.md`. Reject or quarantine records that fail validation.
2. **Cleaning and Validation**: Handle missing values, duplicates, type coercion, and outliers. Log data quality metrics (null rates, unique counts, range violations).
3. **Transformation**: Apply business logic, aggregations, joins, and pivots. Use pandas or polars per `references/pandas-polars.md`. Design idempotent transforms (rerunning produces the same result).
4. **ETL/ELT Pipeline**: Structure the pipeline per `references/etl-patterns.md`. Use orchestrators (Airflow, Prefect, dagster) for scheduled or event-driven pipelines when complexity warrants it.
5. **SQL Analytics**: Write analytical queries per `references/sql-transformation.md`. Use CTEs, window functions, and materialized views for complex aggregations.
6. **Dashboards**: Build dashboards per `references/dashboards.md` using Streamlit, Dash, Metabase, or embedded charts.

## Validation
- Pipeline runs end-to-end on test data without errors; cite commands and exit codes.
- Schema validation catches intentionally malformed test records.
- Idempotency: running the pipeline twice on the same input produces identical output.

## Failure handling
- On ingestion failure (missing source, schema mismatch), log the error with the source identifier and skip to the next source rather than aborting the entire pipeline. Report partial results.

## Approval touchpoints
- Refer to `references/approval-levels.md`.
- `LOW`: Local pipeline runs on test data, SQL queries on dev databases.
- `MEDIUM`: Adding data processing dependencies, modifying ingestion schemas, writing to shared data stores.

## Output
- Handoff file in `.agent/context/handoffs/NN-data-pipelines-analytics.md` per `references/output-contract.md`.
- Pipeline code, schema definitions, SQL queries, and dashboard config.

## References index
- `references/etl-patterns.md`: ETL vs ELT patterns and pipeline orchestration.
- `references/data-validation.md`: Data cleaning, schema validation, and quality metrics.
- `references/sql-transformation.md`: SQL analytics patterns, CTEs, and window functions.
- `references/pandas-polars.md`: pandas and polars data processing patterns.
- `references/data-warehousing.md`: Data warehousing, Kimball modeling, and Parquet/Iceberg formats.
- `references/dashboards.md`: Dashboard frameworks and visualization.
- `references/context-contract.md`: Schema for project context.
- `references/output-contract.md`: Standard handoff output structure.
- `references/approval-levels.md`: Operational risk levels.
- `references/untrusted-content.md`: Untrusted content handling rules.
