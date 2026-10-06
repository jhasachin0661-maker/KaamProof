#!/usr/bin/env python3
"""
Context CLI tool for Antigravity dev-orchestrator.
Stdlib Python only.
"""

import sys
import os
import json
import re
from pathlib import Path

SECRET_PATTERNS = [
    re.compile(r'sk-[a-zA-Z0-9]{20,}'),
    re.compile(r'AKIA[0-9A-Z]{16}'),
    re.compile(r'-----BEGIN [A-Z ]*PRIVATE KEY-----'),
    re.compile(r'ghp_[a-zA-Z0-9]{36}'),
    re.compile(r'glpat-[a-zA-Z0-9\-]{20}'),
    re.compile(r'bearer\s+[a-zA-Z0-9\._\-]{20,}', re.IGNORECASE),
    re.compile(r'eyJ[a-zA-Z0-9_\-]{20,}\.eyJ[a-zA-Z0-9_\-]{20,}')  # JWT token pattern
]

DEFAULT_CONTEXT = {
    "schema_version": "1.0",
    "project": {"name": "", "mode": "existing", "profile": [], "data_sensitivity": []},
    "stack": {"language": [], "framework": [], "package_manager": "", "database": "", "orm": "", "styling": "", "auth": "", "ai": [], "deployment_target": ""},
    "commands": {
        "install": {"cmd": "", "verified": False, "last_exit": None},
        "dev": {"cmd": "", "verified": False, "last_exit": None},
        "build": {"cmd": "", "verified": False, "last_exit": None},
        "test": {"cmd": "", "verified": False, "last_exit": None},
        "lint": {"cmd": "", "verified": False, "last_exit": None},
        "typecheck": {"cmd": "", "verified": False, "last_exit": None}
    },
    "environment": {"target": "unknown", "external_services": []},
    "task": {"current": "", "requirements": [], "constraints": []},
    "plan": [],
    "files": {"changed": [], "relevant": []},
    "status": {"build": "unknown", "tests": "unknown", "lint": "unknown", "types": "unknown", "security": "unknown"},
    "knowledge": {"verified": [], "assumptions": []},
    "decisions": [],
    "known_issues": [],
    "open_questions": [],
    "approvals": [],
    "next_actions": []
}

def get_context_file():
    root = Path.cwd()
    ctx_dir = root / ".agent" / "context"
    ctx_dir.mkdir(parents=True, exist_ok=True)
    return ctx_dir / "project-context.json"

def is_secret(val_str):
    for pattern in SECRET_PATTERNS:
        if pattern.search(val_str):
            return True
    return False

def cmd_init():
    ctx_file = get_context_file()
    if not ctx_file.exists():
        ctx_file.write_text(json.dumps(DEFAULT_CONTEXT, indent=2), encoding="utf-8")
        print(f"Initialized context at {ctx_file}")
    else:
        print(f"Context file already exists at {ctx_file}")

def cmd_get(path_str):
    ctx_file = get_context_file()
    if not ctx_file.exists():
        print("Error: project-context.json does not exist. Run init first.", file=sys.stderr)
        sys.exit(1)

    data = json.loads(ctx_file.read_text(encoding="utf-8"))
    keys = path_str.split('.')
    curr = data
    for k in keys:
        if isinstance(curr, dict) and k in curr:
            curr = curr[k]
        else:
            print(f"Error: Path '{path_str}' not found in context.", file=sys.stderr)
            sys.exit(1)
    print(json.dumps(curr, indent=2))

def cmd_set(path_str, json_val_str):
    if is_secret(json_val_str):
        print("SECURITY ERROR: Refusing to store value that looks like a secret or API token!", file=sys.stderr)
        sys.exit(1)

    try:
        val = json.loads(json_val_str)
    except Exception:
        val = json_val_str

    if is_secret(str(val)):
        print("SECURITY ERROR: Refusing to store value that looks like a secret or API token!", file=sys.stderr)
        sys.exit(1)

    ctx_file = get_context_file()
    if not ctx_file.exists():
        cmd_init()

    data = json.loads(ctx_file.read_text(encoding="utf-8"))
    keys = path_str.split('.')
    curr = data
    for k in keys[:-1]:
        if k not in curr or not isinstance(curr[k], dict):
            curr[k] = {}
        curr = curr[k]
    curr[keys[-1]] = val

    ctx_file.write_text(json.dumps(data, indent=2), encoding="utf-8")
    print(f"Set '{path_str}' successfully.")

def cmd_append_handoff(skill_name, handoff_file_str):
    root = Path.cwd()
    handoffs_dir = root / ".agent" / "context" / "handoffs"
    handoffs_dir.mkdir(parents=True, exist_ok=True)

    src = Path(handoff_file_str)
    if not src.exists():
        print(f"Error: Source handoff file {src} not found.", file=sys.stderr)
        sys.exit(1)

    count = len(list(handoffs_dir.glob("*.md"))) + 1
    dest = handoffs_dir / f"{count:02d}-{skill_name}.md"
    content = src.read_text(encoding="utf-8")
    dest.write_text(content, encoding="utf-8")
    print(f"Appended handoff for {skill_name} to {dest}")

def cmd_validate():
    ctx_file = get_context_file()
    if not ctx_file.exists():
        print("Validation Error: project-context.json does not exist.", file=sys.stderr)
        sys.exit(1)

    try:
        data = json.loads(ctx_file.read_text(encoding="utf-8"))
    except Exception as e:
        print(f"Validation Error: Invalid JSON in project-context.json: {e}", file=sys.stderr)
        sys.exit(1)

    if data.get("schema_version") != "1.0":
        print(f"Validation Error: schema_version mismatch. Expected '1.0', got '{data.get('schema_version')}'", file=sys.stderr)
        sys.exit(1)

    required_keys = {"schema_version", "project", "stack", "commands", "environment", "task", "plan", "files", "status", "knowledge"}
    missing = required_keys - set(data.keys())
    if missing:
        print(f"Validation Error: Missing required top-level key(s): {', '.join(sorted(missing))}", file=sys.stderr)
        sys.exit(1)

    print("Context validation PASSED (schema_version 1.0 verified).")

def main():
    if len(sys.argv) < 2:
        print("Usage: ctx.py <init|get|set|append-handoff|validate> [args...]")
        sys.exit(1)

    subcmd = sys.argv[1]
    if subcmd == "init":
        cmd_init()
    elif subcmd == "get":
        if len(sys.argv) < 3:
            print("Usage: ctx.py get <path>")
            sys.exit(1)
        cmd_get(sys.argv[2])
    elif subcmd == "set":
        if len(sys.argv) < 4:
            print("Usage: ctx.py set <path> <json_value>")
            sys.exit(1)
        cmd_set(sys.argv[2], sys.argv[3])
    elif subcmd == "append-handoff":
        if len(sys.argv) < 4:
            print("Usage: ctx.py append-handoff <skill_name> <handoff_file>")
            sys.exit(1)
        cmd_append_handoff(sys.argv[2], sys.argv[3])
    elif subcmd == "validate":
        cmd_validate()
    else:
        print(f"Unknown subcommand: {subcmd}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
