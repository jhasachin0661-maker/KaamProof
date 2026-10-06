---
name: uiux-visual-design
description: Design visual interfaces, layouts, design tokens, typography, and UI component systems. Trigger whenever creating visual designs, styling interfaces, building component libraries, establishing color schemes, or fixing UI layouts, even if visual-design is not explicitly named. Enforces contrast compliance and design system reuse.
metadata:
  category: uiux
  priority: P1
  layer: build
  version: 0.1.0
  reads_from: core-repo-discovery, uiux-research-flows
  risk_max: LOW
---

# UI/UX Visual Design

## Purpose
Create, structure, and refine high-quality visual user interfaces, design tokens, color systems, typography scale, spacing grids, component libraries, and page layouts. Enforces design system reuse, accessibility color contrast compliance (WCAG AA), and component state completeness.

## When NOT to use
- Do not use for writing pure backend database queries or server API endpoints without user interface components.
- Do not invent custom ad-hoc styling utility classes when the repository already has an established design system or UI library (e.g., Tailwind, Shadcn UI, Material UI, Ant Design).

## Inputs
- Repository styling configuration, design tokens, CSS/Tailwind configs, mockups, and `.agent/context/project-context.json`.

## Procedure
1. **Design System Inspection**: Inspect existing workspace styling configuration (Tailwind config, CSS variables, component library). Reuse existing tokens and UI primitives rather than creating redundant styles.
2. **Visual Hierarchy & Spacing**: Enforce consistent 8pt/4pt spatial grid systems, layout alignment, and typographic hierarchy. Refer to `references/hierarchy-spacing.md`.
3. **Typography System**: Apply fluid typography scales, line-height proportions, and font weight hierarchy. Refer to `references/typography.md`.
4. **Color System & Contrast Compliance**: Establish semantic color tokens (primary, secondary, neutral, success, warning, error, surface). Enforce WCAG AA contrast ratio compliance (minimum 4.5:1 for normal text, 3:1 for large text). Refer to `references/color-tokens.md`.
5. **Component States Completeness**: Ensure every visual component supports interactive states (default, hover, focus-visible, active, disabled, loading, empty, error). Refer to `references/component-states.md`.
6. **Page Layout Patterns**: Apply layout structures tailored to application archetype (Dashboard, SaaS app, Landing page, Mobile view). Refer to `references/page-patterns.md`.

## Validation
- Existing repository design tokens and component libraries reused where available.
- Color contrast verified against WCAG AA 4.5:1 ratio standard.
- Loading, empty, error, and disabled states defined for components.

## Failure handling
- If color contrast checks fail, adjust lightness/saturation values of semantic tokens to meet WCAG AA standards before finalizing styles.

## Approval touchpoints
- Refer to `references/approval-levels.md`.
- `LOW`: Modifying CSS styles, updating design tokens, designing layout components. Fully autonomous.

## Output
- Handoff file in `.agent/context/handoffs/NN-uiux-visual-design.md` per `references/output-contract.md`.
- Updated design tokens, component style definitions, or layout primitives.

## References index
- `references/hierarchy-spacing.md`: Visual hierarchy rules, grid layouts, and spatial scales.
- `references/typography.md`: Font stacks, type scale, line heights, and readability.
- `references/color-tokens.md`: Palette construction, semantic tokens, and WCAG AA contrast checking.
- `references/component-states.md`: Design patterns for loading, empty, error, hover, and disabled states.
- `references/page-patterns.md`: Layout patterns for Dashboards, SaaS interfaces, Landings, and Mobile views.
- `references/context-contract.md`: Schema for project context.
- `references/output-contract.md`: Standard handoff output structure.
- `references/approval-levels.md`: Operational risk levels.
- `references/untrusted-content.md`: Untrusted content handling rules.
