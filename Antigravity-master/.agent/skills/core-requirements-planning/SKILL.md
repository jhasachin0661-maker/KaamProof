---
name: core-requirements-planning
description: Translate vague or large asks into structured requirements, PRDs, user stories, acceptance criteria, and task DAGs. Trigger whenever the user asks to build me, plan, write a PRD, break down user stories, or create a roadmap, even if requirements-planning is not named.
metadata:
  category: core
  priority: P0
  layer: understand
  version: 0.1.0
  reads_from: core-repo-discovery
  risk_max: LOW
---

# Core Requirements Planning

## Purpose
Deconstruct high-level or ambiguous user requests into formal requirements (`requirements.md`), acceptance criteria (Given/When/Then), task dependency DAGs, risk evaluations, and definition-of-done criteria.

## When NOT to use
- Do not use for small, fully specified single-line bug fixes or minor edits where requirements are already unambiguous.

## Inputs
- User prompt requirement.
- Repository state and `.agent/context/project-context.json` (if existing codebase mode).

## Procedure
1. **Context & Mode Assessment**: If an existing codebase exists, read `.agent/context/project-context.json` first to understand current capabilities and stack constraints.
2. **Fact vs. Assumption Separation**: Distinguish verified facts (citing file/repo evidence) from assumptions. Record all unconfirmed requirements as explicit assumptions.
3. **Data & Security Sensitivity Check**: Flag PII, credit card / payment data, or regulatory compliance requirements (GDPR, HIPAA) immediately.
4. **Requirements & PRD Generation**: Draft `requirements.md` using `references/prd-template.md`, outlining functional requirements, non-functional constraints, and security boundaries.
5. **Acceptance Criteria & Breakdown**: Define acceptance criteria using Given/When/Then syntax per `references/acceptance-criteria.md`. Deconstruct work into vertical task DAGs using `references/task-breakdown.md`.
6. **Batched Clarification**: Batch all unresolved critical questions into a single consolidated list. Avoid asking multiple piecemeal questions.

## Validation
- Requirements document: `requirements.md` created with functional & non-functional sections.
- Acceptance criteria: Given/When/Then criteria defined for every task.
- Scope boundary: No unrequested scope expansion; data sensitivity flags recorded.

## Failure handling
- If project mode or stack details are missing, run `core-repo-discovery` before finalizing non-functional requirements.

## Approval touchpoints
- Refer to `references/approval-levels.md`.
- `LOW` risk. Read-only requirements breakdown and documentation planning.

## Output
- Handoff in `.agent/context/handoffs/NN-core-requirements-planning.md` per `references/output-contract.md`.
- `requirements.md` and updated `.agent/context/project-context.json` task queue.

## References index
- `references/prd-template.md`: Template for PRDs and formal requirements.
- `references/task-breakdown.md`: Guidelines for creating DAG task breakdowns.
- `references/acceptance-criteria.md`: Given/When/Then acceptance criteria rules.
- `references/context-contract.md`: Project context schema.
- `references/output-contract.md`: Standard handoff output structure.
- `references/approval-levels.md`: Risk levels and escalation rules.
- `references/untrusted-content.md`: Untrusted content handling rules.
