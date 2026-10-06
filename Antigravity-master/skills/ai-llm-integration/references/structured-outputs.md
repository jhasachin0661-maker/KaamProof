# Type-Safe Structured Outputs

## OpenAI Structured Outputs (`response_format`)
```typescript
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";

const UserProfileSchema = z.object({
  name: z.string(),
  age: z.number(),
  skills: z.array(z.string())
});

const completion = await openai.beta.chat.completions.parse({
  model: "gpt-4o-2024-08-06",
  messages: [{ role: "user", content: "Extract profile for John Doe, 30 years old, developer." }],
  response_format: zodResponseFormat(UserProfileSchema, "user_profile"),
});

const profile = completion.choices[0].message.parsed;
```

## Python Pydantic Schema Example
```python
from pydantic import BaseModel
from openai import OpenAI

class Extraction(BaseModel):
    summary: str
    key_points: list[str]

client = OpenAI()
completion = client.beta.chat.completions.parse(
    model="gpt-4o-2024-08-06",
    messages=[{"role": "user", "content": "..."}],
    response_format=Extraction,
)
result = completion.choices[0].message.parsed
```
