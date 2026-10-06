# Workflow: Upgrade Dependencies

**Instruction to Agent:** Adopt the `dev-orchestrator` skill and execute the following plan template to upgrade dependencies.

## Plan Template

1. **audit**: Run dependency audit tools to identify outdated or vulnerable packages (`core-dependency-management`).
2. **small batches**: Group updates into small, logical batches (e.g., development tools vs. runtime libraries).
3. **tests after each**: After upgrading a batch, run the full test suite, type checks, and build process. Revert or fix if broken.
4. **gate**: Pass the quality release gate (`quality-release-gate`).
5. **PR**: Open a pull request containing the dependency upgrades.
