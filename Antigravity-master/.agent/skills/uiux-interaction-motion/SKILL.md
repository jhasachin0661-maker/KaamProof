---
name: uiux-interaction-motion
description: Micro-interactions, animation and motion design, loading transitions; respect prefers-reduced-motion; performance-safe animation. Trigger whenever implementing micro-interactions, page transitions, UI animations, or motion effects, even if interaction motion is not explicitly named.
metadata:
  category: uiux
  priority: P2
  layer: build
  version: 0.1.0
  reads_from: uiux-visual-design
  risk_max: LOW
---

# UI/UX Interaction & Motion Design

## Purpose
Design and implement fluid UI micro-interactions, motion effects, loading transitions, and state changes. Enforce performance-safe GPU-accelerated CSS/JS animations (animating `transform` and `opacity` only) and strictly respect user accessibility preferences (`@media (prefers-reduced-motion: reduce)`).

## When NOT to use
- Do not use for static layout design or color palette selection without animation (use `uiux-visual-design`).
- Do not use for backend data fetching or state management (use `frontend-web-app`).

## Inputs
- Frontend component files (`.tsx`, `.vue`, `.css`), visual tokens, `.agent/context/project-context.json`.

## Procedure
1. **Motion Principles & Easing**:
   - Apply physics-based easing curves (`cubic-bezier(0.4, 0, 0.2, 1)`) and short durations (150ms-300ms) per `references/motion-principles.md`.
2. **Performance-Safe Animation**:
   - Limit animated CSS properties strictly to GPU-composited attributes (`transform`, `opacity`). Avoid animating layout-triggering properties (`width`, `height`, `margin`, `top`). Refer to `references/css-vs-js-animation.md`.
3. **Micro-Interactions & Transitions**:
   - Implement button click feedback, card hover elevations, skeleton pulse loaders, and modal dialog scale/fade transitions.
4. **Reduced Motion Accessibility (`prefers-reduced-motion`)**:
   - Wrap all CSS keyframes and transitions in `@media (prefers-reduced-motion: reduce)` media queries to instantly substitute motion for simple opacity fades or zero-duration transitions.

## Validation
- All CSS animations use GPU-safe properties (`transform`, `opacity`).
- `@media (prefers-reduced-motion: reduce)` overrides present for every animated component.
- Zero layout thrashing or Frame Dropping (60fps animation target).

## Failure handling
- If JS animation library causes main thread stutter, fall back to pure CSS transitions/transforms.

## Approval touchpoints
- Refer to `references/approval-levels.md`.
- `LOW`: Adding CSS animation classes, motion components, and micro-interaction styling.

## Output
- Handoff file in `.agent/context/handoffs/NN-uiux-interaction-motion.md` per `references/output-contract.md`.
- Animated UI components with reduced-motion accessibility fallbacks.

## References index
- `references/motion-principles.md`: Micro-interaction timing, easing curves, and duration rules.
- `references/css-vs-js-animation.md`: Performance guide comparing CSS keyframes, Framer Motion, and Web Animations API.
- `references/context-contract.md`: Schema for project context.
- `references/output-contract.md`: Standard handoff output structure.
- `references/approval-levels.md`: Operational risk levels.
- `references/untrusted-content.md`: Untrusted content handling rules.
