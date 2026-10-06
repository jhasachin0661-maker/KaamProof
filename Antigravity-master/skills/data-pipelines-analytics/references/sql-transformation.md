# SQL Transformation Patterns & dbt

## Common Table Expressions (CTEs)
Structure SQL queries using modular CTEs for readability and maintainability.

```sql
WITH raw_orders AS (
    SELECT order_id, customer_id, amount, order_date, status
    FROM staging.stg_orders
    WHERE status != 'cancelled'
),

customer_aggregates AS (
    SELECT
        customer_id,
        COUNT(order_id) AS total_orders,
        SUM(amount) AS lifetime_value,
        MAX(order_date) AS last_order_date
    FROM raw_orders
    GROUP BY customer_id
)

SELECT
    c.customer_id,
    c.email,
    COALESCE(ca.total_orders, 0) AS total_orders,
    COALESCE(ca.lifetime_value, 0.0) AS lifetime_value,
    ca.last_order_date
FROM staging.stg_customers c
LEFT JOIN customer_aggregates ca ON c.customer_id = ca.customer_id;
```

## Window Functions
- **Ranking**: `ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date DESC)` to get the latest record per customer.
- **Running Totals**: `SUM(amount) OVER (PARTITION BY customer_id ORDER BY order_date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)`.
- **Lag/Lead**: `LAG(order_date, 1) OVER (PARTITION BY customer_id ORDER BY order_date)` for cohort and time-between-events calculation.

## dbt (data build tool) Best Practices
- **Staging Layer (`models/staging/`)**: Clean, rename, cast types, 1-to-1 with source tables.
- **Intermediate Layer (`models/intermediate/`)**: Business logic joins and aggregations.
- **Marts Layer (`models/marts/`)**: Dimensional models (fact and dimension tables) consumed by reporting tools.
