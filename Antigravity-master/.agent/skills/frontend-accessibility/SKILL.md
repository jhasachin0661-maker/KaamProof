---
name: frontend-accessibility
description: Audit and build accessible web UIs adhering to WCAG 2.1 AA, semantic HTML, ARIA patterns, keyboard navigation, focus management, contrast, accessible forms, and screen reader support. Trigger whenever fixing accessibility violations, managing focus, auditing ARIA roles, or implementing accessible modals, even if accessibility is not named.
metadata:
  category: frontend
  priority: P1
  layer: verify
  version: 0.1.0
  reads_from: frontend-web-app
  risk_max: LOW
---

# Frontend Accessibility

## Purpose
Ensure web UIs are fully accessible to users with disabilities by implementing and auditing WCAG 2.1 AA compliance, semantic HTML5 tags, ARIA attributes, keyboard navigation focus traps, screen reader labels, form accessibility, and contrast standards. Supports both Build Mode (creating accessible components) and Audit Mode (evaluating existing components).

## When NOT to use
- Do not use for general visual styling or layout aesthetics without accessibility implications (use `uiux-visual-design`).
- Do not use for testing backend business logic or API contracts (use `testing-engineering`).

## Inputs
- Component source code (`.tsx`, `.jsx`, `.vue`, `.html`), DOM elements, CSS styles, `.agent/context/project-context.json`.

## Procedure
1. **Mode Determination**:
   - **Audit Mode**: Run automated accessibility linters (`axe-core`, `eslint-plugin-jsx-a11y`, `pa11y`). Inspect existing markup against `references/wcag-checklist.md`.
   - **Build Mode**: Construct accessible components using semantic HTML tags (`<nav>`, `<main>`, `<article>`, `<button>`, `<header>`, `<footer>`).
2. **Semantic HTML & ARIA Rules**:
   - Prefer native semantic HTML over ARIA wherever possible.
   - When custom interactive elements are necessary, apply correct WAI-ARIA roles, states, and properties per `references/aria-patterns.md`.
3. **Form Accessibility**:
   - Ensure every `<input>` has an associated `<label>` (via `htmlFor`/`id` or nesting).
   - Use `aria-describedby` for helper text and `aria-invalid="true"` with `role="alert"` for inline validation errors per `references/forms.md`.
4. **Modals & Complex Navigation**:
   - Implement focus trapping, `Escape` key listeners, `aria-modal="true"`, and initial focus placement for dialogs per `references/modals-navigation.md`.
   - Ensure skip links exist (`<a href="#main-content">Skip to content</a>`) for keyboard users.
5. **Keyboard & Focus Management**:
   - Ensure all interactive elements are reachable via `Tab` key and operable via `Enter`/`Space`.
   - Never suppress outline indicators (`outline: none`) without providing a visible custom focus ring (`:focus-visible`).
6. **Empirical Verification**:
   - Run accessibility audit suite or linters (exit code 0).
   - Verify keyboard tab flow and focus trapping.

## Validation
- Automated accessibility linter / `axe-core` check passes with 0 violations.
- All interactive controls operable strictly via keyboard (`Tab`, `Shift+Tab`, `Enter`, `Space`, `Esc`).
- Form inputs have associated labels and ARIA error descriptions.

## Failure handling
- If accessibility linter fails, extract failing DOM node, classify WCAG criterion violation, apply minimal HTML/ARIA fix, and re-run audit.

## Approval touchpoints
- Refer to `references/approval-levels.md`.
- `LOW`: Code edits to frontend JSX/HTML templates and local linter execution.

## Output
- Handoff file in `.agent/context/handoffs/NN-frontend-accessibility.md` per `references/output-contract.md`.
- Accessibility Audit Report containing WCAG findings, violations fixed, and keyboard test results.

## References index
- `references/wcag-checklist.md`: Comprehensive WCAG 2.1 AA guidelines and checklist.
- `references/aria-patterns.md`: WAI-ARIA role definitions, states, and properties.
- `references/forms.md`: Accessible form controls, labels, error messages, and fieldsets.
- `references/modals-navigation.md`: Accessible modal dialogs, focus trapping, sidebars, and dropdowns.
- `references/context-contract.md`: Schema for project context.
- `references/output-contract.md`: Standard handoff output structure.
- `references/approval-levels.md`: Risk levels and escalation rules.
- `references/untrusted-content.md`: Untrusted content and anti-tamper safety rules.
