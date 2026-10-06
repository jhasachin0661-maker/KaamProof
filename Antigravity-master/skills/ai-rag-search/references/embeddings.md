# Embedding Models

## Model Selection
| Provider | Model | Dimensions | Max Tokens | Notes |
|----------|-------|-----------|------------|-------|
| OpenAI | text-embedding-3-small | 1536 | 8191 | Good quality/cost balance |
| OpenAI | text-embedding-3-large | 3072 | 8191 | Higher quality, higher cost |
| Cohere | embed-english-v3.0 | 1024 | 512 | Supports search_document/search_query input types |
| Local | sentence-transformers/all-MiniLM-L6-v2 | 384 | 256 | Free, fast, lower quality |
| Local | BAAI/bge-large-en-v1.5 | 1024 | 512 | Strong open-source option |

## Integration Pattern
```python
from openai import OpenAI
client = OpenAI()

def embed(texts: list[str]) -> list[list[float]]:
    response = client.embeddings.create(
        model="text-embedding-3-small",
        input=texts
    )
    return [item.embedding for item in response.data]
```

## Best Practices
- Batch embedding calls to reduce API round trips (max 2048 inputs per OpenAI call).
- Normalize embeddings if using cosine similarity (OpenAI embeddings are pre-normalized).
- Use the same model for indexing and querying; mixing models produces meaningless similarity scores.
- Cache embeddings for unchanged documents to avoid redundant API costs.
- Store the model name and version alongside vectors for reproducibility.
