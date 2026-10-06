#!/usr/bin/env python3
"""
Stack Detection Script for core-repo-discovery
Scans repository root and outputs stack metadata JSON matching context contract.
Stdlib Python only.
"""

import os
import json
from pathlib import Path

def detect_stack():
    root = Path.cwd()

    stack = {
        "language": [],
        "framework": [],
        "package_manager": "unknown",
        "database": "",
        "orm": "",
        "styling": "",
        "auth": "",
        "ai": [],
        "deployment_target": ""
    }

    commands = {
        "install": {"cmd": "", "verified": False, "last_exit": None},
        "dev": {"cmd": "", "verified": False, "last_exit": None},
        "build": {"cmd": "", "verified": False, "last_exit": None},
        "test": {"cmd": "", "verified": False, "last_exit": None},
        "lint": {"cmd": "", "verified": False, "last_exit": None},
        "typecheck": {"cmd": "", "verified": False, "last_exit": None}
    }

    # 1. Check Node / TS / JS
    pkg_json = root / "package.json"
    if pkg_json.exists():
        stack["language"].append("JavaScript")
        if (root / "tsconfig.json").exists():
            stack["language"].append("TypeScript")
            commands["typecheck"]["cmd"] = "npx tsc --noEmit"

        if (root / "pnpm-lock.yaml").exists():
            stack["package_manager"] = "pnpm"
        elif (root / "yarn.lock").exists():
            stack["package_manager"] = "yarn"
        elif (root / "bun.lockb").exists() or (root / "bun.lock").exists():
            stack["package_manager"] = "bun"
        else:
            stack["package_manager"] = "npm"

        pm = stack["package_manager"]
        commands["install"]["cmd"] = f"{pm} install"

        try:
            content = json.loads(pkg_json.read_text(encoding="utf-8"))
            scripts = content.get("scripts", {})
            deps = {**content.get("dependencies", {}), **content.get("devDependencies", {})}

            if "build" in scripts:
                commands["build"]["cmd"] = f"{pm} run build"
            if "test" in scripts:
                commands["test"]["cmd"] = f"{pm} test"
            if "lint" in scripts:
                commands["lint"]["cmd"] = f"{pm} run lint"
            if "dev" in scripts:
                commands["dev"]["cmd"] = f"{pm} run dev"

            # Framework detection
            if "next" in deps:
                stack["framework"].append("Next.js")
            if "react" in deps:
                stack["framework"].append("React")
            if "vue" in deps:
                stack["framework"].append("Vue")
            if "express" in deps:
                stack["framework"].append("Express")

            # ORM / Auth
            if "prisma" in deps or (root / "prisma" / "schema.prisma").exists():
                stack["orm"] = "Prisma"
            elif "drizzle-orm" in deps:
                stack["orm"] = "Drizzle"

            if "next-auth" in deps or "@auth/core" in deps:
                stack["auth"] = "NextAuth"

            if "tailwindcss" in deps:
                stack["styling"] = "TailwindCSS"
        except Exception:
            pass

    # 2. Check Python
    req_txt = root / "requirements.txt"
    pyproject = root / "pyproject.toml"
    if req_txt.exists() or pyproject.exists():
        stack["language"].append("Python")
        if (root / "poetry.lock").exists():
            stack["package_manager"] = "poetry"
            commands["install"]["cmd"] = "poetry install"
            commands["test"]["cmd"] = "poetry run pytest"
        else:
            stack["package_manager"] = "pip"
            commands["install"]["cmd"] = "pip install -r requirements.txt"
            commands["test"]["cmd"] = "pytest"

        if pyproject.exists():
            try:
                txt = pyproject.read_text(encoding="utf-8")
                if "django" in txt.lower():
                    stack["framework"].append("Django")
                if "fastapi" in txt.lower():
                    stack["framework"].append("FastAPI")
                if "flask" in txt.lower():
                    stack["framework"].append("Flask")
            except Exception:
                pass

    # 3. Check Rust
    if (root / "Cargo.toml").exists():
        stack["language"].append("Rust")
        stack["package_manager"] = "cargo"
        commands["build"]["cmd"] = "cargo build"
        commands["test"]["cmd"] = "cargo test"
        commands["lint"]["cmd"] = "cargo clippy"

    # 4. Check Go
    if (root / "go.mod").exists():
        stack["language"].append("Go")
        stack["package_manager"] = "go"
        commands["build"]["cmd"] = "go build ./..."
        commands["test"]["cmd"] = "go test ./..."

    # 5. Check Containers & Deployment
    if (root / "Dockerfile").exists() or (root / "docker-compose.yml").exists():
        stack["deployment_target"] = "Docker"

    output_data = {
        "stack": stack,
        "commands": commands
    }

    print(json.dumps(output_data, indent=2))
    return output_data

if __name__ == "__main__":
    detect_stack()
