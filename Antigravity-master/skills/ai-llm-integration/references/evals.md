# LLM Evals & Benchmark Framework

## Structure
Store eval queries and expected assertion outcomes in `evals/evals.json`.

```json
{
  "skill_name": "ai-llm-integration",
  "evals": [
    {
      "id": 1,
      "prompt": "Extract user attributes into a Zod schema",
      "expected_output": "Parsed JSON object matching Zod schema",
      "expectations": [
        "LLM output passes Zod parse without validation errors",
        "Tool call is executed cleanly"
      ]
    }
  ]
}
```

## Grading Assertions
- Programmatic assertions (schema validation, regex match, JSON parse).
- Grader LLM assertions (subjective tone, semantic accuracy check).
