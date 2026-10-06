# Tool Design for AI Agents

## Tool Schema
Every tool must have:
- **Name**: Clear, verb-based (e.g., `search_web`, `read_file`, `create_issue`).
- **Description**: What the tool does and when to use it. Guides the LLM's tool selection.
- **Parameters**: Typed JSON schema with required/optional fields and descriptions.
- **Return type**: Structured response the agent can parse.

## Risk Classification
Classify every tool using the approval model:
- `LOW`: Read-only tools (search, read file, list directory).
- `MEDIUM`: State-modifying tools (write file, create branch, install package).
- `HIGH`: Destructive or external tools (delete files, send emails, modify databases).
- `CRITICAL`: Irreversible external impact (deploy, publish, delete infrastructure).

## Error Handling
```python
class ToolResult:
    success: bool
    output: str
    error: str | None

def execute_tool(name: str, args: dict) -> ToolResult:
    try:
        result = tools[name](**args)
        return ToolResult(success=True, output=str(result), error=None)
    except Exception as e:
        return ToolResult(success=False, output="", error=str(e))
```

## Best Practices
- Validate all arguments before execution; return clear error messages for invalid inputs.
- Keep tool descriptions concise but specific; vague descriptions cause the LLM to misuse tools.
- Limit the number of tools to 10-20; too many tools degrade selection accuracy.
- Include examples in tool descriptions for complex argument formats.
- Log every tool invocation with arguments and results for audit and debugging.
