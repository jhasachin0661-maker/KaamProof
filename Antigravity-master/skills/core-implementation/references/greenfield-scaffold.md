# Greenfield Project Scaffolding Guidelines

When creating a new application from scratch (greenfield mode), use official non-interactive CLI generators.

## Official Generator Commands

| Stack / Framework | Generator Command | Notes |
|---|---|---|
| Next.js / TypeScript | `npx -y create-next-app@latest ./ --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --no-git` | Non-interactive flags |
| Vite (React / Vue / Svelte) | `npx -y create-vite@latest ./ --template react-ts` | Non-interactive template |
| Express API | `npm init -y && npm install express dotenv && npm install -D typescript @types/node @types/express tsx` | Minimal TypeScript setup |
| FastAPI (Python) | `python -m venv venv && pip install fastapi uvicorn pydantic` | Standard virtualenv setup |
| Rust Binary / Library | `cargo init .` | Stdlib cargo scaffolding |

## Scaffolding Rules
1. **Current Directory**: Always initialize in the current directory (`./`).
2. **Non-Interactive**: Use `-y` or explicit CLI flags so execution proceeds without waiting for prompt input.
3. **No Scratch Overwrites**: Never overwrite an existing project directory without explicit confirmation.
