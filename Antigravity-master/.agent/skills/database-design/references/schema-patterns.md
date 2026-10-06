# Schema Design Patterns & Normalization

## Normalization vs Denormalization
- **Third Normal Form (3NF)**: Default for transactional RDBMS (OLTP). Minimizes data redundancy and anomaly risks.
- **Denormalization**: Use selectively for high-throughput read paths, materialized analytics views, or NoSQL document stores.
