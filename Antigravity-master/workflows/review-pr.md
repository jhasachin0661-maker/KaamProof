# Workflow: Review PR

**Instruction to Agent:** Adopt the `dev-orchestrator` skill and execute the following plan template to review a pull request. This is a read-only operation.

## Plan Template

1. **diff**: Analyze the code diff of the pull request.
2. **code review + secure-coding + tests check**: Perform a comprehensive code review focusing on code quality (`quality-code-review`), security best practices (`security-secure-coding`), and adequate test coverage.
3. **findings report**: Generate a findings report summarizing feedback, issues, and suggestions for improvement. Do not modify the code directly.
