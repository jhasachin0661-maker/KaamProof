# Stack Signatures & Detection Patterns

This document defines signatures for detecting application stacks from workspace manifest files.

## Detection Rules Table

| Indicator File | Detected Element | Primary Commands Discovered |
|---|---|---|
| `package.json` | Node.js / JavaScript / TypeScript | Read `scripts` object (`build`, `test`, `lint`, `typecheck`, `dev`) |
| `tsconfig.json` | TypeScript | `tsc --noEmit` |
| `next.config.js` / `next.config.mjs` / `next.config.ts` | Next.js Framework | `next build`, `next dev` |
| `vite.config.js` / `vite.config.ts` | Vite / React / Vue / Svelte | `vite build`, `vite dev` |
| `requirements.txt` / `pyproject.toml` / `Pipfile` | Python | `pytest`, `flake8` / `black` / `ruff`, `mypy` |
| `Cargo.toml` | Rust | `cargo build`, `cargo test`, `cargo clippy` |
| `go.mod` | Go | `go build`, `go test ./...`, `golangci-lint` |
| `composer.json` | PHP | `vendor/bin/phpunit`, `phpstan` |
| `prisma/schema.prisma` | Prisma ORM | `npx prisma validate`, `npx prisma db push` |
| `drizzle.config.ts` / `drizzle.config.js` | Drizzle ORM | `npx drizzle-kit generate` |
| `Dockerfile` / `docker-compose.yml` | Containerized App | `docker compose build`, `docker compose up` |
| `.github/workflows/*.yml` | GitHub Actions CI/CD | Inspect CI steps for test & build commands |

## Framework Adaptation Policy
- Always adapt to the project's existing framework and package manager (`npm`, `yarn`, `pnpm`, `bun`, `poetry`, `pip`).
- NEVER impose a new framework, test runner, or package manager on an existing repository.
