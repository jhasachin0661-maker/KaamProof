# GraphQL Schema Design Guidelines

## Schema Structure
- Use Relay-compliant cursor connection specification for list fields (`edges`, `node`, `pageInfo`).
- Wrap mutation inputs in single `input` argument objects (`updateProfile(input: UpdateProfileInput!)`).
- Use `@deprecated(reason: "...")` directive for field deprecations.
