# System Prompting & Hallucination Reduction

## Principles
1. **Role & Constraint Harness**: State precise capability boundaries in System Prompt.
2. **Theory of Mind & Rationale**: Explain *why* formatting and output rules are necessary rather than shouting commands.
3. **Few-Shot Examples**: Provide 2-3 input/output pairs showing expected structure.
4. **Grounded In-Context Data**: Force model to cite context passages directly to prevent hallucinating facts.

## System Prompt Harness Example
```markdown
You are an expert technical documentation assistant.
Your task is to extract API parameter tables from context snippets.
Rules:
- Include ONLY parameters explicitly present in the provided context.
- If a parameter type is unspecified, write "unknown" rather than inventing a type.
```
