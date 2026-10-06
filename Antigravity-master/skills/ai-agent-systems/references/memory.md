# Agent Memory Systems

## Conversation Memory (Short-Term)
| Strategy | Description | Trade-off |
|----------|-------------|-----------|
| Full history | Pass all messages to the LLM | Hits context limits on long conversations |
| Sliding window | Keep last N messages | Loses early context |
| Summary | Periodically summarize and compress | Lossy but scalable |
| Token-limited | Trim oldest messages to fit token budget | Simple, predictable |

## Long-Term Memory
- **Vector store**: Embed past interactions and retrieve relevant ones per query. Useful for recalling facts from previous sessions.
- **Knowledge graph**: Store entities and relationships extracted from conversations. Good for structured domain knowledge.
- **Key-value store**: Explicit user preferences, settings, or facts the agent should remember.

## Implementation Pattern
```python
class AgentMemory:
    def __init__(self, max_tokens=4000):
        self.messages = []
        self.max_tokens = max_tokens
        self.summary = ""

    def add(self, role, content):
        self.messages.append({"role": role, "content": content})
        self._trim()

    def _trim(self):
        while self._token_count() > self.max_tokens:
            # Summarize oldest messages, then remove them
            oldest = self.messages[:5]
            self.summary = summarize(self.summary, oldest)
            self.messages = self.messages[5:]

    def get_context(self):
        return [{"role": "system", "content": self.summary}] + self.messages
```

## Best Practices
- Start with sliding window; add summarization only when conversations consistently exceed the context window.
- Store memory externally (database, file) for persistence across sessions.
- Separate factual memory (what the user told you) from procedural memory (what steps you took).
