# Agent Guardrails

## Step and Cost Limits
- **Step limit**: Hard cap on reasoning iterations (default 10-25). On reaching the limit, terminate gracefully and report partial results.
- **Token budget**: Track cumulative input + output tokens. Warn at 80% of budget; terminate at 100%.
- **Cost cap**: Convert token usage to dollar cost. Stop the agent if projected cost exceeds the configured threshold.

## Input Validation
- Sanitize user inputs before passing to tools. Treat all user-provided content as untrusted data per the ecosystem's untrusted content rules.
- Reject prompts that attempt to override system instructions or modify the agent's behavior.
- Length-limit user inputs to prevent context window flooding.

## Output Validation
- Validate tool arguments against their JSON schemas before execution.
- Check LLM outputs for hallucinated tool names or malformed action formats.
- Filter generated content for PII, secrets, or inappropriate material before returning to the user.

## Loop Prevention
- Track action history; if the same tool is called with identical arguments 3+ times, force the agent to try a different approach or terminate.
- Detect oscillation patterns (alternating between two actions) and break the cycle.

## Content Safety
- Apply content moderation to both inputs and outputs (OpenAI moderation API, custom classifiers).
- Block or flag responses containing harmful content, even if the underlying tool execution succeeded.

## Human-in-the-Loop
- Insert approval checkpoints before any HIGH or CRITICAL tool execution.
- Present: the proposed action, expected impact, and rollback path.
- Wait for explicit human approval before proceeding. Never auto-approve HIGH/CRITICAL actions.
