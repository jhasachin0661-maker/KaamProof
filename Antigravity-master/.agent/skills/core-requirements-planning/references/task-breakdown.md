# Task Breakdown & DAG Guidelines

Deconstruct high-level goals into vertical slices that deliver verifiable end-to-end functionality.

## Vertical Slice Deconstruction Rules
1. **Vertical over Horizontal**: Build full vertical slices (DB -> API -> UI) rather than horizontal layers (all DB first, all UI last).
2. **Dependency Graph**: Express work as a Directed Acyclic Graph (DAG).
3. **Parallel Safety**: Mark tasks as `parallel_safe: true` only if they touch disjoint file sets and do not share state.

## Task Breakdown Schema
```markdown
### Task 1: [Title]
- **ID**: T-01
- **Skill**: [skill-name]
- **Dependencies**: None
- **Risk**: LOW | MEDIUM | HIGH | CRITICAL
- **Parallel Safe**: true | false
- **Deliverables**: [Files to create or modify]
```
