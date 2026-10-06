# Eliminating Flaky Tests

## Causes & Remedies
- **Cause 1: Hardcoded sleep timers**: Replace `sleep()` / `setTimeout()` with dynamic assertion polling (`expect().toBeVisible()`).
- **Cause 2: Shared mutable test state**: Ensure tests are isolated and clean up seeded database state before/after running.
- **Cause 3: Animation race conditions**: Disable CSS transitions during test runs.
