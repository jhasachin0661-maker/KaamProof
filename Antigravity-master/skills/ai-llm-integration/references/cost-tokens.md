# Token Cost Optimization & Context Management

## Token Reduction Techniques
1. **Context Truncation**: Keep sliding message history window (< 10 recent messages) to avoid token context bloat.
2. **Model Tiering**: Route simple classification tasks to fast/cheap models (`gpt-4o-mini`, `claude-3-5-haiku`, `gemini-2.5-flash`) and complex reasoning to main models (`gpt-4o`, `claude-3-5-sonnet`).
3. **Prompt Caching**: Utilize provider prompt caching (Anthropic Prompt Caching, OpenAI Automatic Caching) for large system prompts and static docs context.
