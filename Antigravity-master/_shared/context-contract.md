# Context Contract

Context file location: `.agent/context/project-context.json`
Handoffs location: `.agent/context/handoffs/NN-skill.md`

## JSON Schema
```json
{
  "schema_version": "1.0",
  "project": {
    "name": "",
    "mode": "existing|greenfield",
    "profile": [],
    "data_sensitivity": []
  },
  "stack": {
    "language": [],
    "framework": [],
    "package_manager": "",
    "database": "",
    "orm": "",
    "styling": "",
    "auth": "",
    "ai": [],
    "deployment_target": ""
  },
  "commands": {
    "install": {"cmd": "", "verified": false, "last_exit": null},
    "dev": {"cmd": "", "verified": false, "last_exit": null},
    "build": {"cmd": "", "verified": false, "last_exit": null},
    "test": {"cmd": "", "verified": false, "last_exit": null},
    "lint": {"cmd": "", "verified": false, "last_exit": null},
    "typecheck": {"cmd": "", "verified": false, "last_exit": null}
  },
  "environment": {
    "target": "local|staging|production|unknown",
    "external_services": []
  },
  "task": {
    "current": "",
    "requirements": [],
    "constraints": []
  },
  "plan": [
    {
      "id": "",
      "skill": "",
      "status": "todo|doing|done|blocked",
      "risk": "LOW"
    }
  ],
  "files": {
    "changed": [],
    "relevant": []
  },
  "status": {
    "build": "unknown",
    "tests": "unknown",
    "lint": "unknown",
    "types": "unknown",
    "security": "unknown"
  },
  "knowledge": {
    "verified": [
      {
        "fact": "",
        "evidence": ""
      }
    ],
    "assumptions": [
      {
        "text": "",
        "needs_confirmation": false
      }
    ]
  },
  "decisions": [],
  "known_issues": [],
  "open_questions": [],
  "approvals": [
    {
      "action": "",
      "level": "",
      "scope": "",
      "granted": false
    }
  ],
  "next_actions": []
}
```

## Ownership & Operating Rules
1. **Secret Handling**: Store secret NAMES only (e.g., `DATABASE_URL`), never actual values or tokens.
2. **Section Ownership**: Each skill writes only its relevant domain sections. The orchestrator (`dev-orchestrator`) uniquely owns `plan` and `approvals`.
3. **Environment Default**: If `environment.target` is missing or `unknown`, treat the environment as `production` for safety.
4. **Gitignore & Persistence**: `.agent/context/` must be gitignored. Architecture/design decisions must be promoted to permanent records in `docs/adr/`.
5. **Schema Versioning**: A `schema_version` mismatch requires the orchestrator to halt execution immediately rather than guessing field schemas.
