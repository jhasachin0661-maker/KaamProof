# Grounding and Citation

## Purpose
Ensure LLM-generated answers are traceable to retrieved source documents. Grounding reduces hallucination and gives users verifiable references.

## Citation Pattern
1. **Chunk metadata**: Every retrieved chunk carries source document ID, title, URL/path, page number, and character offsets.
2. **Inline citation**: The LLM prompt instructs the model to cite sources using numbered references (e.g., [1], [2]).
3. **Source list**: Append a "Sources" section to the response listing all cited documents with links.

## Prompt Template
```
Answer the user's question using ONLY the context provided below.
If the context does not contain enough information, say so.
Cite sources using [1], [2], etc.

Context:
{context_with_numbered_sources}

Question: {question}
```

## Verification
- Parse the generated answer for citation markers.
- Verify each citation index maps to a retrieved chunk.
- Flag answers that contain claims without any citation.
- Use faithfulness scoring (RAGAS or LLM-as-judge) to detect unsupported statements.

## Hallucination Mitigation
- Constrain the system prompt to use only provided context.
- Set temperature to 0 or near-0 for factual retrieval tasks.
- Implement a post-generation check: extract claims from the answer and verify each against the retrieved chunks.
- If the retrieval returns low-confidence results (below a similarity threshold), return "I don't have enough information" rather than guessing.
