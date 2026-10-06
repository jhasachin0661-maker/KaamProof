VENDORED FROM _shared — DO NOT EDIT HERE

# Approval Levels & Escalation Rules

Approval levels are classified by the potential **EFFECT** of an action and the targeted **ENVIRONMENT**. If unsure of the risk level of an action, always classify one level higher.

## Risk Classification Matrix

| Level | Description & Scoped Actions | Execution Rules |
|---|---|---|
| **LOW** | Read-only analysis; creating/editing working tree files; running local unit tests, linter, type check, build; updating documentation; local environment setup. | Fully autonomous execution. |
| **MEDIUM** | Adding/upgrading dependencies; multi-file refactoring; creating local git commits or branches; editing CI scripts; dev database schema modifications; localhost DAST testing. | Autonomous execution with mandatory pre-action git checkpoint, logged justification, and summary highlight. |
| **HIGH** | Deleting non-generated files; git history rewrites; force-pushing feature branches; shared/staging DB schema or data changes; security scanning against non-localhost targets; spending budget; installing global/system software; sending messages to real users from staging environments. | Pause execution and request human approval. Approvals may be scoped to session/action (recorded in `.agent/context/project-context.json` `approvals`). |
| **CRITICAL** | Production deployment; production DB migrations or destructive data operations; credential generation/rotation; payments or billing changes; publishing releases/packages; permissions/IAM modifications; irreversible infrastructure operations (`terraform destroy`, bucket/DB deletion); external user impact; force-pushing to protected branches; disabling security controls. | Pause execution. Present explicit action plan, blast radius analysis, rollback strategy, and dry-run output. Requires explicit per-action human approval; never pre-granted, never cached across sessions. |

## Escalation Rules
1. **Uncertainty Principle**: If an operation does not clearly fit into LOW or MEDIUM, automatically escalate to HIGH or CRITICAL.
2. **Environment Precedence**: Any operation targeting `staging` or `production` immediately elevates to at least HIGH or CRITICAL respectively, regardless of command simplicity.
3. **Enforcement Boundary**: Skill text and level declarations are advisory guidelines for the model. Real enforcement relies on host command allow/deny lists, repository branch protections, and isolating production credentials from dev environments.
