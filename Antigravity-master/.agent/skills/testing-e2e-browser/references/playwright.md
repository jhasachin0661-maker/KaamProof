# Playwright Best Practices

## Locators & Auto-Waiting
- Use user-facing role locators: `page.getByRole('button', { name: 'Submit' })`, `page.getByLabel('Email')`.
- Playwright automatically waits for elements to be actionable before performing actions. Avoid explicit wait calls.
- Capture traces on retry for failure debugging (`trace: 'on-first-retry'`).
