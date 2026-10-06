---
name: frontend-web-app
description: Build and maintain web frontend applications using modern web frameworks. Trigger whenever creating web UIs, components, forms, client state management, routing, SSR/SSG rendering, or responsive web views, even if frontend is not explicitly named. Enforces version checks, unsanitized HTML prevention, and secret safety.
metadata:
  category: frontend
  priority: P1
  layer: build
  version: 0.1.0
  reads_from: core-repo-discovery, uiux-visual-design
  risk_max: MEDIUM
---

# Frontend Web App

## Purpose
Build, maintain, and structure modern web frontend applications, components, client-side routing, state management, and rendering strategies. Enforces version verification, accessibility standards, responsive design, state handling, and client bundle security.

## When NOT to use
- Do not use for standalone backend database migrations or pure server API design without UI components.
- Do not use for mobile native framework applications (e.g., React Native, Flutter) which belong in mobile skills.

## Inputs
- Workspace component files, styling files, and `.agent/context/project-context.json`.

## Procedure
1. **Version Check**: Read framework and library versions from `package.json` (e.g. React 18 vs 19, Next.js 14 vs 15 App Router vs Pages Router, Vue 2 vs 3). Verify version-sensitive APIs against official documentation or `core-research`.
2. **Framework & Architecture Selection**: Match existing component architecture (React, Next.js, Vue, Angular, Svelte, Tailwind). Refer to `references/react.md`, `references/nextjs.md`, `references/vue.md`, `references/angular.md`, `references/svelte.md`, `references/tailwind.md`.
3. **Rendering Mode Determination**: Choose appropriate rendering strategy (SSR, SSG, ISR, Client Components vs Server Components). Refer to `references/rendering-modes.md`.
4. **View States Implementation**: For EVERY data view and component, explicitly implement loading, empty, and error states.
5. **Form & State Management**: Implement forms with schema validation and state management patterns. Refer to `references/forms-validation.md` and `references/state-management.md`.
6. **Internationalization (i18n)**: Format user-facing text, dates, numbers, and currencies using i18n abstractions when present. Refer to `references/i18n.md`.
7. **Security Guardrails**:
   - Never inject unsanitized HTML (avoid `dangerouslySetInnerHTML`, `v-html`).
   - Never embed secret keys in client-side bundles (e.g. `NEXT_PUBLIC_` or `VITE_` prefix must contain public tokens only).
8. **Empirical Validation**: Execute verified build, lint, and typecheck commands. Verify exit code 0.

## Validation
- Framework version check verified before applying code edits.
- Loading, empty, and error states present for data components.
- Build and typecheck commands exit code 0 verified.

## Failure handling
- If hydration mismatch or build compilation errors occur, capture browser/build console logs and route to `core-debugging`.

## Approval touchpoints
- Refer to `references/approval-levels.md`.
- `LOW`: Modifying UI components, styling, and client state. Fully autonomous.
- `MEDIUM`: Upgrading major UI library dependencies or introducing new global state frameworks.

## Output
- Handoff file in `.agent/context/handoffs/NN-frontend-web-app.md` per `references/output-contract.md`.
- Summary of created/modified UI components and verification exit codes.

## References index
- `references/react.md`: React component patterns, hooks, and version differences.
- `references/nextjs.md`: Next.js App Router, React Server Components (RSC), and version caveats.
- `references/vue.md`: Vue 3 Composition API, Reactivity, and SFC patterns.
- `references/angular.md`: Angular standalone components and signals.
- `references/svelte.md`: Svelte and SvelteKit component patterns.
- `references/tailwind.md`: Tailwind CSS styling and utility organization.
- `references/rendering-modes.md`: SSR, SSG, ISR, and Hydration strategies.
- `references/forms-validation.md`: Form handling and schema validation.
- `references/state-management.md`: Client state management patterns.
- `references/i18n.md`: Internationalization guidelines.
- `references/context-contract.md`: Schema for project context.
- `references/output-contract.md`: Standard handoff output structure.
- `references/approval-levels.md`: Operational risk levels.
- `references/untrusted-content.md`: Untrusted content handling rules.
