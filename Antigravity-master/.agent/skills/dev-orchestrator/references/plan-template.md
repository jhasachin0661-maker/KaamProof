# Plan DAG Format (`.agent/context/plan.md`)

Plans are organized into a Directed Acyclic Graph (DAG) of vertical slices.

## `.agent/context/plan.md` Template

```markdown
# Execution Plan: [Task Title]

- **Project Mode**: existing | greenfield
- **Selected Profile**: [Profile Name]
- **Target Environment**: local | staging | production

## Vertical Slices DAG

### Slice 1: [Slice Title]
- **ID**: slice-01
- **Skill**: [skill-name]
- **Inputs**: [input files / context dependencies]
- **Outputs**: [deliverable files / artifacts]
- **Risk Level**: LOW | MEDIUM | HIGH | CRITICAL
- **Parallel Safe**: true | false
- **Status**: todo | doing | done | blocked
- **Dependencies**: none

### Slice 2: [Slice Title]
- **ID**: slice-02
- **Skill**: [skill-name]
- **Inputs**: [inputs]
- **Outputs**: [outputs]
- **Risk Level**: LOW | MEDIUM | HIGH | CRITICAL
- **Parallel Safe**: true | false
- **Status**: todo | doing | done | blocked
- **Dependencies**: slice-01
```
