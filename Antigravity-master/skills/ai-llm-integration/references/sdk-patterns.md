# LLM SDK Initialization Patterns

## OpenAI Node.js SDK (v4+)
```typescript
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const response = await openai.chat.completions.create({
  model: "gpt-4o",
  messages: [{ role: "user", content: "Hello" }]
});
```

## Anthropic TypeScript SDK (v0.20+)
```typescript
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

const response = await anthropic.messages.create({
  model: "claude-3-5-sonnet-20241022",
  max_tokens: 1024,
  messages: [{ role: "user", content: "Hello" }]
});
```

## Google Gen AI SDK (`@google/genai`)
```typescript
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const response = await ai.models.generateContent({
  model: "gemini-2.5-flash",
  contents: "Hello"
});
```
