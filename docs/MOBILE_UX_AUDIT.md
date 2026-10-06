# KaamProof Mobile UX/UI Audit

Audit date: 2026-09-26

Scope: repository and route audit only. No product UI or backend changes were made in this phase.

## Current architecture

- Next.js App Router with a public landing route (`/`), authenticated application route (`/app`), public certificate verification route (`/verify/[certificateId]`), and route handlers under `/api`.
- The authenticated product is currently concentrated in `src/app/app/page.tsx`. Worker, employer, admin/review, modals, forms, data loading, and most navigation are implemented in one large client component.
- Styling is Tailwind utility markup plus a large compatibility layer in `src/app/globals.css`. Design tokens are present, but legacy utility classes remain heavily interleaved with screens.
- Authentication uses phone/password APIs and an HttpOnly session cookie. No authentication or authorization rewrite is required for the redesign.
- PostgreSQL access is Drizzle ORM over `pg`; API handlers enforce role and ownership boundaries server-side.

## Route inventory

### Product routes

- `/` — landing and authentication entry point.
- `/app` — authenticated worker/employer application shell.
- `/verify/[certificateId]` — public verification view.

### API routes

- `/api/auth/login`, `/api/auth/register`, `/api/auth/logout`, `/api/auth/me`, `/api/auth/password`
- `/api/work-sessions` — start/end/list work sessions.
- `/api/metrics` — worker metrics and active-session state.
- `/api/employment` — employer relationships and wage agreements.
- `/api/payments` — payment records and confirmations.
- `/api/disputes` — dispute creation and status.
- `/api/certificates` — certificate generation/listing.
- `/api/verify/[certificateId]` — public certificate verification data.
- `/api/export` — authenticated data export.
- `/api/review` — employer/admin review and audit data.
- `/api/consents` — consent records.
- `/api/health` — health check.

## Component inventory

- `src/app/app/page.tsx`: authenticated shell, top security bar, desktop navigation, worker tabs, employer/admin views, home, history, payments, passport, disputes, profile, forms, certificate modal, employer modal, loading and toast states.
- `src/components/PendingRequests.tsx`: pending employment/agreement actions.
- `src/components/ChangePasswordCard.tsx`: password change form.
- `src/app/page.tsx`: landing/authentication UI.
- `src/app/verify/[certificateId]/page.tsx`: public certificate verification UI.
- No dedicated `MobileHeader`, `BottomNavigation`, mobile card, modal, form-field, or responsive table components exist yet.

## Worker UX problems

1. The worker experience is structured like a desktop dashboard rather than an action-first mobile app.
2. The main worker home uses large desktop cards, excess whitespace, and a wide navigation row before the primary work action.
3. Greeting, employer context, current status, today's work, earnings, pending actions, and recent work are not ordered as a clear mobile decision flow.
4. The primary start/end-work action is visually mixed with legacy dashboard styling and is not consistently full-width on small screens.
5. Worker home still exposes too many secondary destinations at once.
6. Recent work and work history need compact cards with progressive disclosure instead of dense desktop-oriented content.

## Employer UX problems

1. Employer/admin workspaces share the large client page and inherit desktop density.
2. Employer actions need a mobile summary first: active workers, today's attendance, pending confirmations, payments, disputes, then detail cards.
3. Any table-like worker/session views must become stacked cards or expandable rows below tablet widths.
4. Employer/admin mode switching is currently placed in the desktop header and needs a mobile-accessible control.

## Navigation problems

1. The current worker navigation exposes six destinations and uses long bilingual labels.
2. Desktop navigation is still rendered as the primary information architecture; mobile needs five short destinations: Home, Work, Payments, Passport, More.
3. Secondary destinations such as profile, disputes, export, help, settings, and logout need a More surface.
4. Mobile navigation must reserve space for browser safe areas and must not cover the last content card.

## Mobile responsiveness problems

1. The existing UI is mainly desktop-first and relies on large flex/grid groups inside one page.
2. The authenticated page has many fixed horizontal groups, long labels, and modal/form layouts that can become cramped at 320–430px.
3. Legacy class overrides in `globals.css` can override direct text/background utilities, causing contrast regressions such as dark text on primary buttons.
4. A mobile shell has been started, but the underlying worker content still uses desktop cards and hierarchy; it needs a deliberate mobile layout, not only breakpoint hiding.
5. Tables and dense employer/admin content require explicit card transformations.
6. Required viewport QA is not yet evidenced at 320, 360, 375, 390, 393, 412, 430, 768, 1024, 1280, and 1440px.

## Accessibility problems

1. The design must verify WCAG AA contrast after legacy CSS normalization, especially status badges and primary buttons.
2. Long navigation labels reduce scannability and make touch targets crowded.
3. Every icon-only mobile action needs an accessible name; the new profile control has a label, but all existing icon-only controls need a full audit.
4. Focus states, modal focus management, escape behavior, and screen-reader dialog semantics need verification.
5. Toasts should expose appropriate live-region semantics without obscuring mobile controls.
6. Reduced-motion behavior is not yet explicitly defined for existing pulse/spin/transition utilities.

## Typography problems

1. The code uses a generic sans stack and does not explicitly guarantee an Inter + Noto Sans Devanagari stack.
2. Some worker-facing utility classes use 11–13px text for important information; mobile body and key status text should generally be at least 16px.
3. Long Hindi labels are currently used in navigation where short labels would be more readable.
4. Numeric work/payment values should receive stronger hierarchy and may use a technical mono style where useful.

## Form usability problems

1. Forms are distributed inside the large page component rather than using reusable mobile field primitives.
2. Inputs and buttons need a consistent minimum 48px height on mobile.
3. Validation/error placement should be checked per field, not only through global toasts.
4. Employer connection and other important actions should use mobile bottom sheets or full-screen sheets rather than desktop-centered modal proportions.
5. Password forms need clear labels, autocomplete, show/hide affordances, loading feedback, and accessible error messaging.

## Table-to-mobile transformation requirements

- Preserve desktop tables only at tablet/desktop widths where they remain readable.
- Below the tablet breakpoint, render worker/session/payment records as stacked cards.
- Card summary should show the primary identity, work type, date/time, duration or amount, and status.
- Details such as GPS evidence, timestamps, notes, and confirmation history should be progressively disclosed.
- Do not use horizontal page scrolling as the default solution.

## Loading, empty, and error-state gaps

- Loading state exists, but it is generic and should become route/context-specific skeleton or progress messaging.
- Empty states exist in parts of the worker flow but need clear next actions, especially no employer, no work history, no payments, and no disputes.
- Toast feedback exists, but field-level errors, retry actions, and persistent offline/sync states need consistent treatment.
- Offline queue behavior exists in the client logic and needs a visible, understandable sync state on the worker home.

## PWA/mobile gaps

- Viewport metadata exists.
- No evidence of manifest, install metadata, service worker, offline document shell, or mobile-specific app icons beyond the favicon.
- Offline work queue logic exists, but a complete offline UX contract and sync conflict presentation are not yet documented.
- Safe-area handling is needed for the fixed bottom navigation and mobile sheets.

## Recommended implementation order

1. Preserve and document current API/auth/role contracts.
2. Consolidate design tokens, typography, contrast, spacing, radius, and motion rules.
3. Extract a responsive mobile app shell with top bar, content container, and five-item bottom navigation.
4. Refactor worker home into greeting → employer → current work → primary CTA → metrics → pending actions → recent work.
5. Convert worker history, payments, passport, disputes, and profile to mobile cards and focused workflows.
6. Refactor employer/admin mobile views into summary cards and expandable records.
7. Improve sheets, forms, validation, loading, empty, error, and offline states.
8. Add accessibility and reduced-motion QA.
9. Verify all required viewport widths, then polish desktop without allowing desktop structure to dominate mobile.

## Risk assessment

- **High:** `src/app/app/page.tsx` is a large client component; broad edits can break role-specific rendering or API interactions.
- **High:** legacy CSS selectors use broad class matching and can override new utility classes.
- **Medium:** changing navigation IDs or tab state can break existing data loading and deep interactions.
- **Medium:** mobile sheets/modals can affect focus, scrolling, and safe-area behavior.
- **Medium:** employer/admin views have more dense data and require careful card transformation.
- **Low:** token/typography changes are visually broad but do not need backend changes if applied centrally.

## Backend and API status

No backend files or API contracts were modified in this audit. The existing phone/password authentication, sessions, work sessions, payments, disputes, certificates, verification, and role boundaries remain the source of truth for the UI implementation phase.

## Audit conclusion

The repository has the required backend surface for a mobile-first worker product, but the UI is still structurally a desktop dashboard with a mobile breakpoint layer. The next implementation phase should extract the mobile shell and rebuild the worker home hierarchy before broadening the redesign to secondary workflows.
