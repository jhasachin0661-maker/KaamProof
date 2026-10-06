# DAST Safety and Authorization Rules

## Core Rule
Security scanning tools must be strictly defensive and target-authorized. Active network scanning or DAST execution against non-localhost endpoints without explicit user authorization is illegal and dangerous.

## Target Authorization Protocol
1. **Localhost Targets (`http://localhost:*`, `http://127.0.0.1:*`)**:
   - Risk level: `LOW`. Autonomous execution permitted.
2. **External / Remote Targets (`https://staging.example.com`)**:
   - Risk level: `HIGH`.
   - MUST pause execution and request explicit user confirmation of target ownership:
     > "DAST scan requested against `https://staging.example.com`. Please confirm you own or have explicit authorization to scan this target."
   - Never proceed against remote targets without recorded user confirmation in `.agent/context/project-context.json`.
