---
name: ai-rag-search
description: Build retrieval-augmented generation (RAG) pipelines with chunking, embeddings, vector databases (pgvector, FAISS, Pinecone, Qdrant, Weaviate, ChromaDB), semantic search, hybrid retrieval, reranking, retrieval evaluation, and citation/grounding. Trigger whenever building RAG, semantic search, vector search, embedding pipelines, or knowledge retrieval, even if RAG is not explicitly named.
metadata:
  category: ai
  priority: P2
  layer: build
  version: 0.1.0
  reads_from: ai-llm-integration, database-design
  risk_max: MEDIUM
---

# AI RAG Search

## Purpose
Design and build retrieval-augmented generation pipelines: document chunking strategies, embedding model selection, vector database integration, semantic and hybrid search, reranking pipelines, retrieval quality evaluation, and citation/grounding for LLM responses. Framework detail lives in references so the skill stays portable across vector stores and embedding providers.

## When NOT to use
- Do not use for LLM prompt engineering without retrieval (use `ai-llm-integration`).
- Do not use for relational database schema design without vector columns (use `database-design`).
- Do not use for ML model training or computer vision (use `ai-vision-ml`).

## Inputs
- Document corpus, embedding model config, vector store credentials, `.agent/context/project-context.json`.

## Procedure
1. **Chunking Strategy**: Select and implement chunking (fixed-size, sentence, recursive, semantic) per `references/chunking.md`. Chunk size and overlap depend on the embedding model's context window and the retrieval use case.
2. **Embedding Generation**: Choose and integrate an embedding model (OpenAI, Cohere, sentence-transformers, local models) per `references/embeddings.md`. Normalize embeddings if the similarity metric requires it.
3. **Vector Store Setup**: Configure the vector database per `references/pgvector.md` or `references/faiss.md`. Define indexes (HNSW, IVF) and distance metrics (cosine, L2, inner product).
4. **Retrieval Pipeline**: Implement semantic search, keyword search (BM25), and hybrid retrieval with score fusion. Add a reranking step (cross-encoder or Cohere rerank) for precision.
5. **Grounding and Citation**: Attach source metadata to retrieved chunks so the LLM can cite sources per `references/grounding.md`. Validate that generated answers trace back to retrieved context.
6. **Evaluation**: Measure retrieval quality (recall@k, MRR, NDCG) and end-to-end RAG quality (faithfulness, answer relevancy) per `references/retrieval-eval.md`.

## Validation
- Embedding generation and vector upsert commands pass (exit code 0).
- Retrieval returns relevant results for test queries with measurable recall.
- Grounding metadata is present on all retrieved chunks.

## Failure handling
- On embedding API failure, retry with backoff; on vector store connection error, validate credentials and connection string before retrying.

## Approval touchpoints
- Refer to `references/approval-levels.md`.
- `LOW`: Local vector store setup, test queries, evaluation runs.
- `MEDIUM`: Adding embedding or vector store dependencies, modifying index configuration, changing chunk strategies on production data.

## Output
- Handoff file in `.agent/context/handoffs/NN-ai-rag-search.md` per `references/output-contract.md`.
- RAG pipeline code, vector store schema, chunking config, and eval results.

## References index
- `references/chunking.md`: Chunking strategies and configuration.
- `references/embeddings.md`: Embedding model selection and integration.
- `references/pgvector.md`: PostgreSQL pgvector setup, indexing, and queries.
- `references/faiss.md`: FAISS index types, serialization, and GPU acceleration.
- `references/retrieval-eval.md`: Retrieval and RAG quality metrics.
- `references/grounding.md`: Citation, source attribution, and hallucination reduction.
- `references/context-contract.md`: Schema for project context.
- `references/output-contract.md`: Standard handoff output structure.
- `references/approval-levels.md`: Operational risk levels.
- `references/untrusted-content.md`: Untrusted content handling rules.
