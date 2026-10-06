# CSS vs JS Animation Performance

## 1. GPU-Accelerated Properties (60 FPS)
Only animate properties that trigger Composite-only render steps:
- `transform` (`translate3d`, `scale`, `rotate`)
- `opacity`

## 2. Layout Thrashing Properties (Avoid Animating)
Animating these forces Browser Reflow + Repaint (expensive):
- `width`, `height`, `margin`, `padding`, `top`, `left`, `border`

## 3. Technology Selection
- **Pure CSS Transitions**: Best for simple hover, focus, active button states.
- **CSS Keyframes**: Best for continuous loaders, skeleton pulse effects.
- **Framer Motion / WAAPI**: Best for complex React gesture-driven drag/swipe interactions.
