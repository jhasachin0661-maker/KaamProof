# Workflow: Ship Feature

**Instruction to Agent:** Adopt the `dev-orchestrator` skill and execute the following plan template to ship a new feature.

## Plan Template

1. **requirements**: Understand the feature requirements. Ensure clarity before proceeding.
2. **plan slices**: Break down the feature into small, logical implementation slices.
3. **build**: Implement the code for each slice.
4. **verify**: Run tests, type checks, and linters. Ensure the feature works as expected.
5. **docs**: Update relevant documentation, including READMEs, API docs, and ADRs.
6. **gate**: Pass the quality release gate (`quality-release-gate`). **STOP and request approval before proceeding to any HIGH or CRITICAL risk step.**
7. **PR**: Open a pull request with the implemented feature, adhering to conventional commits.
