# React Component Patterns & Guidelines

## Version Check Requirement
Before writing or refactoring React components, check `package.json` for `react` version:
- **React 18**: Use `createRoot`, `useTransition`, `useId`, concurrent features.
- **React 19**: Use `useActionState`, `useFormStatus`, `use`, Server Actions, compiler directives.

## Component Architecture
- Prefer functional components with explicit TypeScript prop interfaces.
- Separate UI presentation from data fetching hooks.
- Use `React.memo` or `useCallback` judiciously when profiling indicates re-render bottlenecks.
