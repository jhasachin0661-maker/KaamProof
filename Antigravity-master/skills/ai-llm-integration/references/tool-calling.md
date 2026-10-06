# Function / Tool Calling Patterns

## Tool Definition Schema
```typescript
const tools = [
  {
    type: "function",
    function: {
      name: "get_weather",
      description: "Get current weather for a location",
      parameters: {
        type: "object",
        properties: {
          location: { type: "string", description: "City and state" }
        },
        required: ["location"]
      }
    }
  }
];
```

## Tool Execution Loop
```typescript
const response = await openai.chat.completions.create({
  model: "gpt-4o",
  messages: messages,
  tools: tools
});

const toolCalls = response.choices[0].message.tool_calls;
if (toolCalls) {
  for (const call of toolCalls) {
    const args = JSON.parse(call.function.arguments);
    const result = await executeTool(call.function.name, args);
    messages.push(response.choices[0].message);
    messages.push({
      role: "tool",
      tool_call_id: call.id,
      content: JSON.stringify(result)
    });
  }
}
```
