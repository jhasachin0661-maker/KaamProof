# Agent Loop Patterns

## ReAct (Reasoning + Acting)
The most common pattern. The agent alternates between reasoning (thought) and acting (tool call), observing results before the next step.

```
Loop:
  1. Thought: Reason about the current state and decide the next action.
  2. Action: Call a tool with specific arguments.
  3. Observation: Receive the tool result.
  4. Repeat or terminate with a final answer.
```

### Termination Conditions
- Agent produces a final answer (explicit "FINAL ANSWER" token or structured output).
- Step limit reached (return partial results with explanation).
- Cost/token budget exhausted.
- All required information gathered.

## Plan-and-Execute
The agent first creates a full plan, then executes steps sequentially, replanning when observations invalidate assumptions.

```
1. Plan: Generate a list of steps to achieve the goal.
2. Execute: Run each step, collecting observations.
3. Replan: If a step fails or reveals new information, update the remaining plan.
4. Terminate: When all plan steps complete or the goal is achieved.
```

## Reflection
After generating an initial response, the agent critiques its own output and iterates.

```
1. Generate: Produce an initial response.
2. Reflect: Critique the response for errors, gaps, or improvements.
3. Revise: Generate an improved response based on the critique.
4. Repeat reflection/revision up to N times.
```

## Implementation Considerations
- Always set a hard step limit (default 10-25) to prevent infinite loops.
- Log every thought-action-observation triple for debugging and evaluation.
- Use structured output (JSON) for action selection to enable reliable parsing.
