# Frontend Performance Guidelines

## Core Web Vitals Targets
- **LCP (Largest Contentful Paint)**: < 2.5 seconds
- **INP (Interaction to Next Paint)**: < 200 ms
- **CLS (Cumulative Layout Shift)**: < 0.1

## Optimization Checklist
1. **Bundle Size & Code Splitting**:
   - Use dynamic imports (`React.lazy()`, `import()`) for routes and heavy dialogs.
   - Run `webpack-bundle-analyzer` or `source-map-explorer` to eliminate duplicate libraries.
2. **Image & Media Optimization**:
   - Use WebP/AVIF formats with responsive `<picture>` or Next.js `<Image />`.
   - Set explicit `width` and `height` attributes to eliminate CLS layout shifts.
3. **Rendering Efficiency**:
   - Virtualize long lists (`react-window`, `tanstack-virtual`) for lists > 100 items.
