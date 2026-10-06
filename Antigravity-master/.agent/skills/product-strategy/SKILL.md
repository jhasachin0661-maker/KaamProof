---
name: product-strategy
description: Analyze product ideas, technical feasibility, feature prioritization (RICE, MoSCoW), MVP scope definition, and launch checklists. Trigger whenever evaluating product concepts, prioritizing backlog features, scoping MVPs, or preparing product launches, even if product strategy is not named.
metadata:
  category: product
  priority: P2
  layer: understand
  version: 0.1.0
  reads_from: none
  risk_max: LOW
---

# Product Strategy

## Purpose
Evaluate product ideas, assess technical and market feasibility, prioritize feature backlogs using structured frameworks (RICE, MoSCoW), define lean Minimum Viable Product (MVP) boundaries, and establish pre-launch readiness checklists.

## When NOT to use
- Do not use for writing technical implementation code or database schemas (use `core-implementation` or `database-design`).
- Do not use for detailed UI visual mockups or wireframes (use `uiux-research-flows` or `uiux-visual-design`).

## Inputs
- Product idea description, market goals, user feedback, `.agent/context/project-context.json`.

## Procedure
1. **Idea Analysis & Feasibility Audit**:
   - Analyze value proposition, target audience, technical feasibility, risks, and assumptions.
2. **Feature Prioritization Frameworks**:
   - Score backlog items using RICE (Reach * Impact * Confidence / Effort) or MoSCoW (Must-have, Should-have, Could-have, Won't-have) per `references/prioritization.md`.
3. **MVP Scope Definition**:
   - Establish minimal viable feature set required to validate core value hypothesis per `references/mvp-scoping.md`. Eliminate bloat.
4. **Launch Readiness Verification**:
   - Compile pre-launch verification checklist across product, technical, analytics, and legal prerequisites per `references/launch-checklist.md`.

## Validation
- Prioritized feature matrix compiled with RICE scores or MoSCoW tiers.
- MVP scope explicitly bounded with accepted vs deferred feature lists.
- Launch checklist verified.

## Failure handling
- If technical feasibility is questionable or effort exceeds budget, flag architectural risks in context and document simpler MVP alternatives.

## Approval touchpoints
- Refer to `references/approval-levels.md`.
- `LOW`: Product analysis, prioritization scoring, and scope documentation.

## Output
- Handoff file in `.agent/context/handoffs/NN-product-strategy.md` per `references/output-contract.md`.
- Bounded MVP specification and prioritized feature backlog document.

## References index
- `references/prioritization.md`: RICE scoring formulas, MoSCoW categorization, and trade-off matrices.
- `references/mvp-scoping.md`: Principles for lean MVP definition and scope slicing.
- `references/launch-checklist.md`: Product launch readiness checklist covering QA, telemetry, and docs.
- `references/context-contract.md`: Schema for project context.
- `references/output-contract.md`: Standard handoff output structure.
- `references/approval-levels.md`: Operational risk levels.
- `references/untrusted-content.md`: Untrusted content handling rules.
