# Regression Testing Guidelines

## Purpose
Every bug fix must include a regression test that proves the bug existed and is now resolved.

## Regression Test Pattern

```typescript
describe('Regression: Issue #142 - Task completion resets priority', () => {
  it('preserves task priority when marking as complete', () => {
    const task = createTask({ title: 'Bug fix', priority: 'high' });
    const completed = markComplete(task);

    // Before the fix, priority was incorrectly reset to 'medium'
    expect(completed.priority).toBe('high');
    expect(completed.status).toBe('done');
  });
});
```

## Rules
1. **Reproduce First**: Write a test that fails against the broken code before applying any fix.
2. **Cite the Issue**: Name the test with the bug ticket ID or description.
3. **Minimal Scope**: Test only the specific behavior that was broken, not the entire feature.
4. **Keep Forever**: Regression tests are permanent. Never delete them after the fix is verified.
