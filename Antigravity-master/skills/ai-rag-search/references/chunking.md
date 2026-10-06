# Chunking Strategies

## Strategy Selection
| Strategy | Best For | Trade-offs |
|----------|----------|------------|
| Fixed-size | Simple documents, uniform content | May split mid-sentence |
| Sentence | Narrative text, articles | Uneven chunk sizes |
| Recursive | Structured docs (markdown, code) | Needs separator hierarchy |
| Semantic | Mixed content, topic shifts | Requires embedding calls for boundary detection |

## Configuration
- **Chunk size**: Match to embedding model context window. OpenAI `text-embedding-3-small` supports 8191 tokens; practical chunk sizes are 256-1024 tokens.
- **Overlap**: 10-20% of chunk size prevents context loss at boundaries.
- **Metadata preservation**: Every chunk must retain source document ID, page/section number, and character offsets for citation.

## Implementation Pattern
```python
from langchain.text_splitter import RecursiveCharacterTextSplitter

splitter = RecursiveCharacterTextSplitter(
    chunk_size=512,
    chunk_overlap=64,
    separators=["\n## ", "\n### ", "\n\n", "\n", ". ", " "]
)
chunks = splitter.split_documents(documents)
```

## Quality Checks
- Verify no chunk exceeds the embedding model's token limit.
- Spot-check that chunks maintain semantic coherence (not cut mid-thought).
- Ensure metadata flows through the pipeline to the vector store.
