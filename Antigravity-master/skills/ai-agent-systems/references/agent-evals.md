# Agent Evaluations

## Evaluation Dimensions
| Dimension | What to Measure | How |
|-----------|----------------|-----|
| Task completion | Did the agent achieve the stated goal? | Binary pass/fail or partial credit scoring |
| Tool selection | Did the agent pick the right tools? | Compare tool sequence to expected sequence |
| Efficiency | How many steps did it take? | Step count, token usage, wall-clock time |
| Safety | Did it respect guardrails and approval gates? | Check for unauthorized actions, budget overruns |
| Robustness | Does it handle edge cases and errors? | Inject tool failures, ambiguous inputs, adversarial prompts |

## Eval Set Construction
1. Define 10-50 scenarios covering common, edge, and adversarial cases.
2. For each scenario, specify:
   - Initial prompt / user request
   - Available tools and their mock responses
   - Expected outcome (final answer, files created, API calls made)
   - Safety expectations (which guardrails should fire)
3. Use deterministic tool mocks for reproducibility.

## Scoring
```python
def score_agent_run(run, expected):
    scores = {
        "task_complete": 1.0 if run.final_answer == expected.answer else 0.0,
        "correct_tools": jaccard(run.tools_used, expected.tools),
        "within_budget": 1.0 if run.steps <= expected.max_steps else 0.0,
        "safe": 1.0 if not run.safety_violations else 0.0,
    }
    return scores
```

## Regression Testing
- Run the full eval set before and after agent changes.
- Flag any scenario where task completion drops or safety violations appear.
- Track metrics over time to detect drift.
