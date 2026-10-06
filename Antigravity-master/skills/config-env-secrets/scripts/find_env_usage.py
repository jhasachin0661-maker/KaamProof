#!/usr/bin/env python3
"""
Scans repository source files for referenced environment variable names.
Stdlib Python only.
"""

import os
import re
import json
from pathlib import Path

ENV_PATTERNS = [
    re.compile(r'process\.env\.([A-Z0-9_]+)'),
    re.compile(r'os\.environ\.get\(["\']([A-Z0-9_]+)["\']\)'),
    re.compile(r'os\.environ\[["\']([A-Z0-9_]+)["\']\]'),
    re.compile(r'os\.getenv\(["\']([A-Z0-9_]+)["\']\)'),
    re.compile(r'env\[["\']([A-Z0-9_]+)["\']\]'),
    re.compile(r'std::env::var\(["\']([A-Z0-9_]+)["\']\)'),
]

IGNORE_DIRS = {'.git', 'node_modules', 'dist', 'build', '.next', '__pycache__', 'venv', '.venv'}

def find_env_usage():
    root = Path.cwd()
    env_vars = {}

    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in IGNORE_DIRS]
        for fname in filenames:
            ext = Path(fname).suffix.lower()
            if ext in {'.ts', '.tsx', '.js', '.jsx', '.py', '.rs', '.go', '.php', '.java'}:
                filepath = Path(dirpath) / fname
                try:
                    content = filepath.read_text(encoding='utf-8', errors='ignore')
                    rel_path = str(filepath.relative_to(root))
                    found = set()
                    for pattern in ENV_PATTERNS:
                        matches = pattern.findall(content)
                        for m in matches:
                            found.add(m)
                    if found:
                        env_vars[rel_path] = sorted(list(found))
                except Exception:
                    pass

    all_vars = sorted(list({var for var_list in env_vars.values() for var in var_list}))

    result = {
        "total_variables": len(all_vars),
        "variables": all_vars,
        "files": env_vars
    }

    print(json.dumps(result, indent=2))
    return result

if __name__ == "__main__":
    find_env_usage()
