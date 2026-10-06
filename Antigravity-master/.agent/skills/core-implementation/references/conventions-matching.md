# Codebase Conventions Matching

Always adapt code changes to match the existing repository conventions.

## Convention Dimensions to Inspect

1. **Imports & Module System**:
   - ESM (`import { foo } from './foo'`) vs CommonJS (`const { foo } = require('./foo')`).
   - Relative imports (`../../components`) vs Aliased imports (`@/components`).
2. **Naming Conventions**:
   - File names: `camelCase.ts`, `kebab-case.ts`, `PascalCase.tsx`, or `snake_case.py`.
   - Variables & Functions: `camelCase` vs `snake_case`.
   - Types / Interfaces: `type UserProps` vs `interface IUserProps`.
3. **Indentation & Formatting**:
   - Indent width (2 spaces, 4 spaces, tabs).
   - Single vs double quotes, semicolons vs no-semicolons.
4. **Error Handling & Async Patterns**:
   - Promises `.then()` vs `async/await`.
   - `try/catch` wrapping vs error boundary helpers.

## Rule
Match the surrounding file style even if it differs from your personal preference. Consistency within a codebase supersedes generic style opinions.
