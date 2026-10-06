VENDORED FROM _shared — DO NOT EDIT HERE

# Output Contract (Handoff Schema)

Every skill must produce a structured handoff document upon completion, written to `.agent/context/handoffs/NN-skill.md`.

## Handoff Header
```markdown
skill: <skill-name>
version: <skill-version>
task_id: <task-identifier>
status: done|partial|blocked|needs_approval
```

## Required Sections
1. **ACTIONS**: Concise bullet points of what actions were performed during execution.
2. **FILES_CHANGED**: List of all files created, modified, or deleted.
3. **COMMANDS_RUN**: Explicit list of commands executed along with their exit codes (e.g., `npm test` (exit 0)).
4. **RESULTS**: Summary of outcomes and key deliverables.
5. **VALIDATION**: Empirical evidence proving success.
   - **Evidence Rule**: Every line in this section MUST cite either a command and exit code (e.g. `pytest` exit 0), or a direct file location with line numbers (e.g. `src/index.ts:L14-L20`). Unverified claims are prohibited.
6. **ERRORS**: Any non-fatal errors, diagnostic messages, or failure summaries.
7. **RISKS**: Identified security, performance, or stability risks.
8. **ASSUMPTIONS**: Technical or domain assumptions made during execution.
9. **NEXT_STEPS**: Recommended follow-up tasks, including `suggested_next` skill recommendations.
10. **HANDOFF**: Final state summary for consumption by `dev-orchestrator` or subsequent skills.
