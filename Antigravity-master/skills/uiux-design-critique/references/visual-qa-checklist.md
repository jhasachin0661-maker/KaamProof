# Visual QA Checklist

## Layout & Hierarchy
- [ ] Primary heading (`h1`) is prominent and visually distinct.
- [ ] Element spacing follows a 4px/8px grid system.
- [ ] Interactive targets (buttons, inputs) have minimum 44x44px touch areas.

## Color & Contrast
- [ ] Text contrast meets WCAG AA 4.5:1 ratio (3:1 for large text).
- [ ] Dark mode and light mode maintain consistent brand identity.
- [ ] Color is not the sole indicator of status (always pair color with icons/text).

## Responsive Viewports
- [ ] Desktop (1920x1080): Layout utilizes whitespace without stretching content excessively.
- [ ] Tablet (768x1024): Multi-column grids wrap gracefully into 2 columns.
- [ ] Mobile (375x812): Single-column view, zero horizontal scrolling, sticky actions reachable with thumbs.

## UI States
- [ ] Loading state: Skeleton screen or spinner shown during async fetch.
- [ ] Empty state: Friendly message with actionable call-to-action when data is empty.
- [ ] Error state: Clear inline validation error message with actionable recovery guidance.
