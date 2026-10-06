# Jest & Vitest Testing Patterns

## Setup & Configuration
- **Jest**: `jest.config.ts` with `ts-jest` or `@swc/jest` transform.
- **Vitest**: `vitest.config.ts` inheriting from `vite.config.ts`.

## Writing Unit Tests

```typescript
import { describe, it, expect } from 'vitest'; // or jest globals
import { calculateTotal } from '../utils/calculateTotal';

describe('calculateTotal', () => {
  it('returns 0 for empty cart', () => {
    expect(calculateTotal([])).toBe(0);
  });

  it('sums item prices with quantities', () => {
    const items = [
      { price: 10, quantity: 2 },
      { price: 5, quantity: 3 },
    ];
    expect(calculateTotal(items)).toBe(35);
  });

  it('handles decimal precision correctly', () => {
    const items = [{ price: 0.1, quantity: 3 }];
    expect(calculateTotal(items)).toBeCloseTo(0.3);
  });
});
```

## Conventions
- Test file placement: co-locate in `__tests__/` or use `.test.ts` / `.spec.ts` suffix.
- Use `describe()` blocks to group tests by function or feature.
- Prefer specific matchers (`toBe`, `toEqual`, `toContain`) over generic `toBeTruthy`.
- Run: `npx vitest run` or `npx jest --no-cache`.
