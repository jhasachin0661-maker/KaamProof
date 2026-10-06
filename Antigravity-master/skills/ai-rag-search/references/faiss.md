# FAISS (Facebook AI Similarity Search)

## Index Types
| Index | Use Case | Trade-offs |
|-------|----------|------------|
| `IndexFlatL2` | Exact search, small datasets (under 100k) | Brute force, perfect recall, slow at scale |
| `IndexIVFFlat` | Medium datasets (100k-10M) | Approximate, requires training |
| `IndexHNSWFlat` | General purpose, good recall | Higher memory, no training needed |
| `IndexIVFPQ` | Large datasets (10M+) | Compressed, lower memory, lower recall |

## Basic Usage
```python
import faiss
import numpy as np

dimension = 1536
index = faiss.IndexFlatL2(dimension)

# Add vectors
vectors = np.array(embeddings, dtype='float32')
index.add(vectors)

# Search
query = np.array([query_embedding], dtype='float32')
distances, indices = index.search(query, k=5)
```

## Serialization
```python
faiss.write_index(index, "vectors.faiss")
index = faiss.read_index("vectors.faiss")
```

## GPU Acceleration
```python
res = faiss.StandardGpuResources()
gpu_index = faiss.index_cpu_to_gpu(res, 0, cpu_index)
```

## ID Mapping
FAISS uses sequential integer IDs. To map back to document IDs:
- Use `IndexIDMap` to wrap any index with custom integer IDs.
- Maintain a separate mapping dictionary or database table for metadata.

## Best Practices
- Normalize vectors before indexing if using inner product similarity.
- Train IVF indexes on a representative sample (10-100x nlist vectors).
- For production, combine FAISS with a metadata store (PostgreSQL, SQLite) for filtering.
