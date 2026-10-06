---
name: testing-e2e-browser
description: Derive, write, and run end-to-end browser tests using Playwright or Cypress. Trigger whenever testing user flows, browser interactions, e2e journeys, visual regression, or mobile viewports, even if e2e is not explicitly named. Enforces tool auto-detection, accessibility checks, and test safety.
metadata:
  category: testing
  priority: P1
  layer: verify
  version: 0.1.0
  reads_from: frontend-web-app, testing-engineering
  risk_max: MEDIUM
---

# Testing E2E Browser

## Purpose
Derive, write, and execute automated end-to-end browser test suites, visual regression checks, mobile viewport responsiveness, cross-browser compatibility tests, and accessibility checks (`axe-core`). Detects existing E2E framework tooling (Playwright vs Cypress) before executing.

## When NOT to use
- Do not use for unit testing isolated functions or micro-benchmarks without browser DOM interaction (use `testing-engineering`).
- Do not run E2E browser tests against live production environments, real payment processors, or real user email accounts.

## Inputs
- Application URL target (localhost or staging), E2E test config files (`playwright.config.ts`, `cypress.config.ts`), user flow specs, and `.agent/context/project-context.json`.

## Procedure
1. **Tool Auto-Detection**: Inspect package manifests and config files (`playwright.config.ts`, `cypress.config.js`/`.ts`) to detect installed E2E framework. Match existing patterns. Refer to `references/playwright.md` and `references/cypress.md`.
2. **Safety & Environment Scoping**: Ensure target base URL is strictly pointing to `localhost` or isolated staging environment. Use designated test accounts only. NEVER execute real financial payments or trigger real user emails.
3. **E2E Test Authoring**: Write resilient user journey tests using user-visible locators (`getByRole`, `getByText`, `findByLabelText`). Avoid brittle CSS/XPath selectors.
4. **Visual Regression Testing**: Capture visual snapshots (`toHaveScreenshot`, `cy.compareSnapshot`) for UI regression detection. Refer to `references/visual-regression.md`.
5. **Mobile Viewport & Cross-Browser Testing**: Configure viewport dimensions (Desktop 1280x720, Mobile 375x812) and browser engines (Chromium, Firefox, WebKit). Refer to `references/mobile-viewport.md`.
6. **In-Browser Accessibility Checks**: Inject accessibility auditing engines (`@axe-core/playwright`, `cypress-axe`) to check WCAG compliance during E2E navigation.
7. **Flaky Test Remediation**: Eliminate arbitrary sleep timers (`setTimeout`, `cy.wait(5000)`). Use explicit auto-waiting locators and web assertions. Refer to `references/flaky-tests.md`.
8. **Execution & Evidence Capture**: Run E2E test runner command. Capture screenshots, video traces, and exit code 0 evidence.

## Validation
- E2E framework auto-detected correctly from project context.
- Target URL restricted to localhost or staging environments.
- Zero arbitrary sleep calls in authored test code.
- Test execution exit code 0 verified.

## Failure handling
- If E2E tests fail due to selector timeout or UI drift, save test artifact trace/screenshot, inspect page state, and route to `core-debugging`.

## Approval touchpoints
- Refer to `references/approval-levels.md`.
- `LOW`: Running local headless E2E tests against localhost. Autonomous.
- `MEDIUM`: Running multi-browser E2E suites against staging environment URLs.

## Output
- Handoff file in `.agent/context/handoffs/NN-testing-e2e-browser.md` per `references/output-contract.md`.
- Summary of executed E2E specs, visual snapshot diffs, and test exit codes.

## References index
- `references/playwright.md`: Playwright setup, auto-waiting, locators, and traces.
- `references/cypress.md`: Cypress patterns, custom commands, and interceptors.
- `references/visual-regression.md`: Visual regression snapshots and threshold comparison.
- `references/flaky-tests.md`: Eliminating test flakiness and dynamic wait strategies.
- `references/mobile-viewport.md`: Mobile viewport emulation and cross-browser testing.
- `references/context-contract.md`: Schema for project context.
- `references/output-contract.md`: Standard handoff output structure.
- `references/approval-levels.md`: Operational risk levels.
- `references/untrusted-content.md`: Untrusted content handling rules.
