# Mongoose Guidelines

## Best Practices
- Define Mongoose schemas with explicit field types, default values, and index specifications.
- Use `autoIndex: false` in production to prevent blocking database startups; create indexes via explicit scripts.
