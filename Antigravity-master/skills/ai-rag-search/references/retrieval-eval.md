# Retrieval Evaluation

## Retrieval Metrics
| Metric | What It Measures | Target |
|--------|-----------------|--------|
| Recall@k | Fraction of relevant docs in top-k | 0.8+ for k=10 |
| Precision@k | Fraction of top-k results that are relevant | Depends on use case |
| MRR (Mean Reciprocal Rank) | Position of first relevant result | 0.7+ |
| NDCG@k | Ranking quality with graded relevance | 0.7+ |
| Hit Rate | Whether any relevant doc appears in top-k | 0.9+ |

## End-to-End RAG Metrics
| Metric | What It Measures |
|--------|-----------------|
| Faithfulness | Does the answer use only retrieved context (no hallucination)? |
| Answer Relevancy | Does the answer address the question? |
| Context Relevancy | Are retrieved chunks relevant to the question? |
| Context Utilization | Does the answer use the retrieved context effectively? |

## Evaluation Tools
- **RAGAS**: Python framework for RAG evaluation (faithfulness, answer relevancy, context precision/recall).
- **LangSmith**: Tracing and evaluation for LangChain pipelines.
- **Custom**: Build eval sets with question-answer-context triples and score with an LLM judge.

## Building Eval Sets
1. Curate 50-100 question-answer pairs from real user queries or domain experts.
2. For each question, annotate the expected relevant source documents.
3. Run retrieval and measure recall@k before tuning chunk size, overlap, or reranker.
4. Track metrics over time to detect regressions from pipeline changes.

## Reranking Evaluation
- Compare retrieval metrics with and without the reranker.
- Measure latency impact; cross-encoder rerankers add 50-200ms per query.
- Consider reranking only the top-20 candidates to balance quality and speed.
