---
name: ai-agent-systems
description: Design and build AI agent loops, tool definitions, memory systems, planning strategies, guardrails, human-in-the-loop checkpoints, cost/step limits, and agent evaluations. Tool permissions follow the approval model. Trigger whenever building AI agents, autonomous loops, tool-calling agents, or multi-step reasoning systems, even if agent-systems is not explicitly named.
metadata:
  category: ai
  priority: P2
  layer: build
  version: 0.1.0
  reads_from: ai-llm-integration
  risk_max: HIGH
---

# AI Agent Systems

## Purpose
Build reliable AI agent architectures: ReAct-style reasoning loops, tool design and registration, short- and long-term memory, planning strategies, safety guardrails, human-in-the-loop approval gates, cost and step budget enforcement, and systematic agent evaluation. Tool permissions follow the ecosystem's approval model.

## When NOT to use
- Do not use for simple LLM API calls without agent loops (use `ai-llm-integration`).
- Do not use for RAG retrieval pipelines without agent orchestration (use `ai-rag-search`).

## Inputs
- Agent specification, tool definitions, LLM provider config, `.agent/context/project-context.json`.

## Procedure
1. **Agent Loop Design**: Choose the loop pattern (ReAct, plan-and-execute, reflection) per `references/agent-loops.md`. Define the observation-thought-action cycle with explicit termination conditions.
2. **Tool Design**: Define typed tool schemas with clear descriptions, argument validation, and error handling per `references/tool-design.md`. Classify each tool by risk level using the approval model.
3. **Memory**: Implement conversation memory (sliding window, summary) and optional long-term memory (vector store, knowledge graph) per `references/memory.md`.
4. **Guardrails**: Add input/output validation, step limits, cost caps, and content safety filters per `references/guardrails.md`. Prevent infinite loops and runaway token spend.
5. **Human-in-the-Loop**: Insert approval checkpoints before HIGH/CRITICAL tool executions. Present the proposed action, expected impact, and rollback path before proceeding.
6. **Evaluation**: Test agent behavior with scenario-based evals measuring task completion, tool selection accuracy, and safety compliance per `references/agent-evals.md`.

## Validation
- Agent loop terminates within the step budget for test scenarios.
- Tool calls are validated against their schemas with 0 runtime type errors.
- Guardrails prevent known dangerous inputs and infinite loop scenarios.
- Human-in-the-loop gates fire correctly for HIGH/CRITICAL tool invocations.

## Failure handling
- On tool execution failure, the agent should log the error, update its reasoning, and either retry with a corrected approach or report the blocker. Max 2 retry cycles per tool call.
- On budget exhaustion (step or token limit), terminate gracefully and report partial results.

## Approval touchpoints
- Refer to `references/approval-levels.md`.
- `MEDIUM`: Adding new tools, modifying agent loop logic, changing memory backends.
- `HIGH`: Agent tools that delete files, modify system state, or access external services.
- Agent tool permissions inherit from the underlying operation's risk classification.

## Output
- Handoff file in `.agent/context/handoffs/NN-ai-agent-systems.md` per `references/output-contract.md`.
- Agent loop implementation, tool definitions, guardrail config, and eval results.

## References index
- `references/agent-loops.md`: ReAct, plan-and-execute, and reflection loop patterns.
- `references/tool-design.md`: Tool schema design, argument validation, and error handling.
- `references/memory.md`: Conversation and long-term memory strategies.
- `references/guardrails.md`: Safety limits, cost caps, content filters, and loop prevention.
- `references/agent-evals.md`: Scenario-based agent evaluation methodology.
- `references/context-contract.md`: Schema for project context.
- `references/output-contract.md`: Standard handoff output structure.
- `references/approval-levels.md`: Operational risk levels.
- `references/untrusted-content.md`: Untrusted content handling rules.
