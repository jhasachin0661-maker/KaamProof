# Motion Principles & Easing Curves

## 1. Duration Rules
- **Micro-interactions (Hover, Click)**: 100ms – 200ms
- **Element Transitions (Dropdown, Tooltip)**: 200ms – 300ms
- **Page / Modal Transitions**: 300ms – 400ms
- Avoid animations longer than 400ms as they feel sluggish to users.

## 2. Standard Easing Curves
- **Ease-Out (Entering elements)**: `cubic-bezier(0.0, 0.0, 0.2, 1)` (starts fast, decelerates to stop).
- **Ease-In (Exiting elements)**: `cubic-bezier(0.4, 0.0, 1, 1)` (starts slow, accelerates out).
- **Standard Ease-In-Out**: `cubic-bezier(0.4, 0.0, 0.2, 1)` (moving between positions on screen).

## 3. Reduced Motion Support (Mandatory)
```css
@media (prefers-reduced-motion: reduce) {
  *, ::before, ::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```
