---
name: arch-system-design
description: Evaluate architectural trade-offs and choose system patterns like monolith, modular monolith, microservices, serverless, event-driven, layered, clean, or hexagonal architecture. Trigger whenever designing software architecture, evaluating system topology, writing ADRs, or balancing team velocity vs ops complexity, even if system design is not named.
metadata:
  category: arch
  priority: P1
  layer: understand
  version: 0.1.0
  reads_from: core-repo-discovery, core-requirements-planning, core-research
  risk_max: LOW
---

# Architectural System Design

## Purpose
Evaluate project requirements, scale, team size, ops complexity, budget, reliability, and velocity to select the optimal system architecture (monolith, modular monolith, microservices, serverless, event-driven, layered, clean, or hexagonal). Strictly avoid over-engineering small applications and output formal Architecture Decision Records (ADRs).

## When NOT to use
- Do not use for low-level function implementation or component coding (use `core-implementation`).
- Do not use for database schema indexing or SQL query tuning (use `database-design`).

## Inputs
- `.agent/context/project-context.json`, requirements from `core-requirements-planning`, research from `core-research`.

## Procedure
1. **Context & Scale Analysis**:
   - Assess project parameters: team size, expected throughput/scale, operational budget, reliability requirements, release velocity goals, and ops complexity capacity.
2. **Architecture Pattern Selection**:
   - Consult `references/decision-matrix.md` to evaluate candidate patterns (monolith, modular monolith, microservices, serverless, event-driven, layered, clean, hexagonal).
3. **Anti-Overengineering Rule**:
   - Apply `references/anti-overengineering.md`. Default to the simplest architecture that satisfies current requirements and 12-month projections.
   - For small/medium teams (<10 engineers), strongly prefer monolith or modular monolith unless extreme independent scaling is proven required.
4. **Trade-off Evaluation**:
   - Document trade-offs regarding operational overhead, network latency, data consistency (ACID vs eventual consistency), and deployment complexity.
5. **ADR Generation**:
   - Generate a structured Architecture Decision Record using `references/adr-template.md`. Save to `docs/adr/00XX-title.md`.

## Validation
- Architectural decision matrix evaluated with explicitly documented score/rationale.
- ADR created in `docs/adr/` matching `references/adr-template.md`.
- Zero unnecessary microservices or distributed complexity introduced for small scope.

## Failure handling
- If requirements are vague or conflicting (e.g. enterprise microservice demand for single-developer MVP), record explicit constraints in project context and present low-ops alternatives.

## Approval touchpoints
- Refer to `references/approval-levels.md`.
- `LOW`: Design phase, documentation generation, and ADR drafting (read-only architecture analysis).

## Output
- Handoff file in `.agent/context/handoffs/NN-arch-system-design.md` per `references/output-contract.md`.
- Generated ADR file in `docs/adr/00XX-<title>.md`.

## References index
- `references/decision-matrix.md`: Scoring matrix for monolith, microservices, serverless, event-driven, clean/hexagonal.
- `references/adr-template.md`: Standard Architecture Decision Record template.
- `references/anti-overengineering.md`: Rules preventing premature distribution and complexity.
- `references/context-contract.md`: Schema for project context.
- `references/output-contract.md`: Standard handoff output structure.
- `references/approval-levels.md`: Risk levels and escalation rules.
- `references/untrusted-content.md`: Untrusted content and anti-tamper safety rules.
