---
name: uiux-design-critique
description: Perform screenshot-based visual QA and design critique on UI screens. Trigger whenever auditing layout hierarchy, evaluating contrast, checking spacing, detecting anti-patterns, inspecting mobile responsiveness, or fixing UI inconsistencies, even if design critique is not named.
metadata:
  category: uiux
  priority: P1
  layer: verify
  version: 0.1.0
  reads_from: uiux-visual-design, testing-e2e-browser
  risk_max: LOW
---

# UI/UX Design Critique

## Purpose
Perform rigorous screenshot-based visual quality assurance (QA) and design critique on web and mobile user interfaces. Detect visual anti-patterns (poor typography hierarchy, cramped spacing, low contrast, inconsistent UI components, missing empty/loading/error states, broken responsive viewports) and provide actionable design remedies.

## When NOT to use
- Do not use for testing underlying API functionality or backend business logic (use `testing-engineering`).
- Do not use for accessibility screen reader or ARIA audit alone (use `frontend-accessibility`).

## Inputs
- Page screenshots, DOM rendered elements, design tokens, `.agent/context/project-context.json`.

## Procedure
1. **Visual QA Execution**:
   - Capture UI screenshots using `testing-e2e-browser` across desktop, tablet, and mobile viewports.
   - Inspect visual presentation against `references/visual-qa-checklist.md`.
2. **Anti-Pattern Detection**:
   - Evaluate visual hierarchy: title sizes, font weight contrast, visual noise.
   - Evaluate spatial layout: cramped paddings, unaligned margins, flex/grid overflow.
   - Evaluate color & contrast: text contrast against background (WCAG AA ratio 4.5:1), uncurated generic colors.
   - Evaluate state coverage: inspect missing loading spinners, empty list indicators, and error boundaries.
   - Consult `references/anti-patterns.md` for specific UI anti-patterns.
3. **Propose & Apply Fixes**:
   - Formulate precise CSS/HTML design fixes (e.g. updating Tailwind classes, CSS custom properties, line heights, responsive breakpoints).
   - Apply fixes to frontend code and re-capture screenshots to verify visual resolution.

## Validation
- Screenshots captured across standard viewports (1920x1080, 768x1024, 375x812).
- Zero anti-pattern violations in visual QA report.
- Visual improvements verified by re-rendering UI screenshots.

## Failure handling
- If UI rendering fails or headless browser cannot start, log headless display failure, fall back to static CSS/HTML code inspection, and output recommended CSS fixes.

## Approval touchpoints
- Refer to `references/approval-levels.md`.
- `LOW`: Visual QA inspection, CSS adjustments, and layout fix proposals.

## Output
- Handoff file in `.agent/context/handoffs/NN-uiux-design-critique.md` per `references/output-contract.md`.
- Visual QA Report containing findings, screenshots, and applied/proposed CSS fixes.

## References index
- `references/anti-patterns.md`: Catalog of common UI design flaws and visual anti-patterns.
- `references/visual-qa-checklist.md`: Visual inspection checklist across hierarchy, spacing, color, states, and viewports.
- `references/context-contract.md`: Schema for project context.
- `references/output-contract.md`: Standard handoff output structure.
- `references/approval-levels.md`: Risk levels and escalation rules.
- `references/untrusted-content.md`: Untrusted content and anti-tamper safety rules.
