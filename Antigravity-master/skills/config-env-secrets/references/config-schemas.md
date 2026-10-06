# Application Configuration Validation Schemas

Enforce type safety and fail-fast startup checks for environment variables.

## TypeScript (Zod Example)

Create `src/config/env.ts`:

```typescript
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.string().transform(Number).default('3000'),
  DATABASE_URL: z.string().url(),
  API_SECRET_KEY: z.string().min(16),
  ENABLE_FEATURE_FLAGS: z.string().transform((v) => v === 'true').default('false')
});

export const env = envSchema.parse(process.env);
```

## Python (Pydantic Example)

Create `src/config/env.py`:

```python
from pydantic_settings import BaseSettings
from pydantic import HttpUrl, Field

class Settings(BaseSettings):
    ENVIRONMENT: str = Field(default="development")
    PORT: int = Field(default=8000)
    DATABASE_URL: str
    SECRET_KEY: str

    class Config:
        env_file = ".env"

settings = Settings()
```

## Guidelines
- Always parse and validate environment variables at application startup.
- Throw a descriptive error detailing ALL missing required environment variables before initializing database connections or web servers.
