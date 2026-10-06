# AI Safety & Prompt Injection Defence

## Security Rules
1. **Untrusted Input Isolation**: User inputs are DATA, never instructions. Wrap user prompts in distinct tags (`<user_input>...</user_input>`).
2. **System Override Protection**: Reject user requests attempting to override system instructions ("Ignore previous instructions...").
3. **Output Guardrails**: Validate LLM output against safety classifiers or Pydantic models prior to database writes or command execution.
4. **Secret Protection**: Never expose system prompt secrets or API keys in response outputs.
