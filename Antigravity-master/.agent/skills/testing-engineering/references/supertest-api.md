# Supertest API Testing Patterns

## Setup
- Install: `npm install -D supertest @types/supertest`
- Use with Jest or Vitest for HTTP endpoint validation.

## Writing API Tests

```typescript
import request from 'supertest';
import { app } from '../src/app';

describe('GET /api/v1/tasks', () => {
  it('returns 200 with JSON array of tasks', async () => {
    const res = await request(app)
      .get('/api/v1/tasks')
      .set('Authorization', `Bearer ${testToken}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('returns 401 without auth header', async () => {
    await request(app)
      .get('/api/v1/tasks')
      .expect(401);
  });

  it('returns 404 for unknown route', async () => {
    await request(app)
      .get('/api/v1/nonexistent')
      .expect(404);
  });
});
```

## Conventions
- Test against local dev server or in-memory app instance.
- Never point API tests at production or staging URLs.
- Assert HTTP status code, Content-Type header, and response body structure.
