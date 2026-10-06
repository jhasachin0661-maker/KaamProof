# Conventional Commits Specification

## Commit Message Format
```
<type>(<scope>): <short summary>

[optional body]

[optional footer(s)]
```

## Commit Types
- `feat`: A new feature for the user or application.
- `fix`: A bug fix.
- `docs`: Documentation changes only.
- `style`: Formatting, missing semi-colons, white-space changes (no production code logic change).
- `refactor`: Code change that neither fixes a bug nor adds a feature.
- `perf`: Code change that improves performance.
- `test`: Adding missing tests or correcting existing tests.
- `chore`: Maintenance tasks, dependencies update, build scripts.

## Examples
- `feat(auth): implement JWT authentication middleware`
- `fix(api): handle null payload gracefully in user creation`
- `docs(readme): update installation instructions for Windows`
