# Node.js Backend Frameworks (Express, Fastify, NestJS)

## Version Check Requirement
Check package versions in `package.json`:
- **Express**: Express 4 vs 5 (Express 5 resolves rejected Promises automatically in async handlers).
- **Fastify**: Fastify 4 vs 5 (plugin registration syntax and schema compilation changes).
- **NestJS**: Nest 9 vs 10 (module resolution and SWC compiler option).

## Layered Architecture
- Controllers handle HTTP routing and request/response serialization.
- Services implement core business domain logic.
- Repositories/ORMs manage data access layer.
