---
name: ai-llm-integration
description: Integrate OpenAI-style LLM APIs, prompt engineering, structured outputs, tool calling, streaming, context management, token optimization, model selection, multimodal inputs, hallucination reduction, AI safety, and evals. Verify SDK and model details against official docs before coding. Trigger whenever building LLM applications, prompt templates, tool calls, or AI features, even if AI/LLM is not explicitly named.
metadata:
  category: ai
  priority: P1
  layer: build
  version: 0.1.0
  reads_from: core-research, config-env-secrets
  risk_max: MEDIUM
---

# AI LLM Integration

## Purpose
Build robust, secure, and cost-effective AI applications using LLM SDKs (OpenAI, Anthropic, Google Gemini, Ollama, LangChain, LlamaIndex). Implement prompt engineering, strict JSON/Pydantic structured outputs, function/tool calling, streaming HTTP responses, context window management, token cost optimization, multimodal inputs, hallucination mitigation, AI safety controls (prompt injection defence, input/output guardrails), and systematic LLM evals. Verify version-sensitive SDK and model details against official documentation before writing code.

## When NOT to use
- Do not use for standalone vector database schema setup without LLM integration (use `database-design`).
- Do not use for computer vision image classification models without LLM interfaces (use `ai-vision-ml`).

## Inputs
- Application codebase, LLM API keys (`OPENAI_API_KEY`, `ANTHROPIC_API_KEY`), schema definitions (Zod/Pydantic), `.agent/context/project-context.json`.

## Procedure
1. **SDK Version & Model Verification**:
   - Verify installed LLM SDK package versions (`openai`, `@anthropic-ai/sdk`, `@google/genai`, `langchain`, `llamaindex`) against current official API documentation per `references/sdk-patterns.md`. Never invent SDK parameters or deprecated model names.
2. **Prompt Engineering & System Harness**:
   - Construct robust system prompts, clear role separation (system, user, assistant), few-shot examples, and strict output boundaries per `references/prompting.md`.
3. **Structured Outputs & Schema Validation**:
   - Enforce type-safe structured outputs using Zod / Pydantic JSON schemas or native function response formats per `references/structured-outputs.md`. Validate LLM responses prior to consumption.
4. **Tool & Function Calling**:
   - Define type-safe tool definitions (`tools`, `tool_choice`) with strict argument parsing per `references/tool-calling.md`.
5. **Streaming & Token Cost Optimization**:
   - Implement SSE / Chunked streaming for real-time user UX.
   - Optimize token usage via prompt truncation, model routing (small vs large models), and caching per `references/cost-tokens.md`.
6. **AI Safety & Guardrails**:
   - Defend against prompt injection, jailbreaking, and untrusted user input tampering using input sanitization and output validation per `references/safety.md`.
7. **Evals & Framework Integration**:
   - Author LLM evals and assertions per `references/evals.md`. Integrate LangChain or LlamaIndex orchestration frameworks when multi-step agentic workflows require them per `references/langchain-llamaindex.md`.

## Validation
- LLM SDK integration tested and verified with active mock or API response (exit code 0).
- Structured output parser validates schema compliance with 0 runtime errors.
- Prompt injection defence rules verified against untrusted input strings.

## Failure handling
- On LLM API rate limit (`429`), context window overflow (`400`), or schema validation error, apply exponential backoff retry with jitter, fallback to smaller model or truncated context, and log error cleanly without leaking API keys.

## Approval touchpoints
- Refer to `references/approval-levels.md`.
- `MEDIUM`: Integrating LLM SDKs, defining tool functions, modifying prompt templates, managing API cost configurations.

## Output
- Handoff file in `.agent/context/handoffs/NN-ai-llm-integration.md` per `references/output-contract.md`.
- Tested LLM integration code, prompt templates, structured output schemas, and eval suites.

## References index
- `references/sdk-patterns.md`: Official SDK instantiation patterns for OpenAI, Anthropic, Gemini, and Ollama.
- `references/structured-outputs.md`: Structured output generation with Zod, Pydantic, and JSON Mode.
- `references/tool-calling.md`: Tool/function definition schemas, execution loops, and argument parsing.
- `references/prompting.md`: System prompt design, few-shot prompting, and hallucination reduction.
- `references/evals.md`: Evaluating LLM outputs, assertion grading, and benchmark sets.
- `references/safety.md`: Defending against prompt injection, jailbreaks, and output safety validation.
- `references/cost-tokens.md`: Token estimation, context window truncation, and model selection.
- `references/langchain-llamaindex.md`: Orchestration framework patterns (LangChain, LlamaIndex).
- `references/context-contract.md`: Schema for project context.
- `references/output-contract.md`: Standard handoff output structure.
- `references/approval-levels.md`: Operational risk levels.
- `references/untrusted-content.md`: Untrusted content handling rules.
