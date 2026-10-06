# Visual Regression Testing

## Snapshot Guidelines
- Compare baseline screenshots against current renders using `expect(page).toHaveScreenshot()` in Playwright or visual plugins in Cypress.
- Disable animations (`animations: 'disabled'`) and mask dynamic data elements (timestamps, user IDs) before taking snapshots.
- Set strict pixel diff threshold tolerances (e.g. `maxDiffPixelRatio: 0.05`).
