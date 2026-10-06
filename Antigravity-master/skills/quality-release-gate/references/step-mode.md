# Quality Release Gate — Step-Mode Protocol

## Execution Protocol
Step-mode is invoked by `dev-orchestrator` after completing a single vertical slice plan step.

### Step-Mode Rules
1. Focus evaluation on files modified within the current vertical slice.
2. Run verified build, lint, and unit test commands.
3. Verify that new code does not introduce secret leaks or broken type checks.
4. Non-applicable category checks for the slice are marked `N/A` with brief rationale.
5. Produce quick verdict to allow orchestrator to proceed to next plan slice or route to debugging.
