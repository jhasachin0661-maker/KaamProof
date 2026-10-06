# pgvector (PostgreSQL Vector Extension)

## Setup
```sql
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE documents (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  embedding vector(1536)  -- match embedding model dimensions
);
```

## Indexing
- **HNSW** (recommended for most cases): Approximate nearest neighbor, good recall/speed balance.
```sql
CREATE INDEX ON documents USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 200);
```
- **IVFFlat**: Faster index build, slightly lower recall.
```sql
CREATE INDEX ON documents USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);
```
- Build HNSW indexes after initial data load for best performance.

## Querying
```sql
-- Cosine similarity search (top 5)
SELECT id, content, metadata,
       1 - (embedding <=> $1::vector) AS similarity
FROM documents
ORDER BY embedding <=> $1::vector
LIMIT 5;
```

## Distance Operators
| Operator | Metric | Index Ops Class |
|----------|--------|-----------------|
| `<=>` | Cosine distance | `vector_cosine_ops` |
| `<->` | L2 (Euclidean) | `vector_l2_ops` |
| `<#>` | Inner product (negative) | `vector_ip_ops` |

## Performance Tips
- Set `hnsw.ef_search` (default 40) higher for better recall at query time.
- Use `WHERE` clause filtering before vector search when possible (pre-filtering).
- Monitor index size; HNSW indexes can be large in memory.
