---
name: uiux-research-flows
description: Develop UX research plans, user personas, user journey maps, Information Architecture (IA), user flows, and low-fidelity ASCII or HTML wireframes. Trigger whenever defining user personas, mapping user journeys, structuring navigation trees, or drafting wireframes, even if UX research is not named.
metadata:
  category: uiux
  priority: P2
  layer: understand
  version: 0.1.0
  reads_from: core-requirements-planning
  risk_max: LOW
---

# UI/UX Research & User Flows

## Purpose
Structure user-centric product experiences by conducting UX research planning, constructing user personas, mapping user journeys, designing Information Architecture (IA) navigation trees, defining step-by-step user flows, and rendering low-fidelity text/ASCII or HTML wireframes.

## When NOT to use
- Do not use for writing production CSS/Tailwind component code (use `uiux-visual-design` or `frontend-web-app`).
- Do not use for automated screenshot visual QA or layout anti-pattern auditing (use `uiux-design-critique`).

## Inputs
- Product requirements from `core-requirements-planning`, user research notes, `.agent/context/project-context.json`.

## Procedure
1. **User Personas & Journey Mapping**:
   - Define primary and secondary user personas (goals, pain points, technical proficiency). Map end-to-end user journeys per `references/personas-journeys.md`.
2. **Information Architecture (IA) & User Flows**:
   - Design site maps, navigation hierarchy, and step-by-step interaction flows per `references/ia-flows.md`.
3. **Wireframe Construction**:
   - Draft low-fidelity wireframes using text/ASCII layouts or clean HTML mockups per `references/wireframes.md`.

## Validation
- Personas defined with explicit goals and pain points.
- User flows mapped from entry trigger to goal completion.
- Wireframes rendered using clean ASCII diagrams or valid HTML templates.

## Failure handling
- If user flow contains dead ends or excessive friction steps, simplify navigation path and re-validate user flow continuity.

## Approval touchpoints
- Refer to `references/approval-levels.md`.
- `LOW`: Research planning, persona definition, IA mapping, and wireframe output.

## Output
- Handoff file in `.agent/context/handoffs/NN-uiux-research-flows.md` per `references/output-contract.md`.
- UX Research artifact containing personas, user flow diagrams, IA trees, and wireframe layouts.

## References index
- `references/personas-journeys.md`: User persona templates and journey mapping framework.
- `references/ia-flows.md`: Information Architecture hierarchy and user flow diagramming rules.
- `references/wireframes.md`: ASCII and HTML low-fidelity wireframing patterns.
- `references/context-contract.md`: Schema for project context.
- `references/output-contract.md`: Standard handoff output structure.
- `references/approval-levels.md`: Operational risk levels.
- `references/untrusted-content.md`: Untrusted content handling rules.
