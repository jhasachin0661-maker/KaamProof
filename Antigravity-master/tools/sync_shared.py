#!/usr/bin/env python3
"""
Syncs shared contract files from _shared/*.md into skills/*/references/
"""

import os
import shutil
from pathlib import Path

HEADER = "VENDORED FROM _shared — DO NOT EDIT HERE\n\n"

def sync_shared():
    project_root = Path(__file__).resolve().parent.parent
    shared_dir = project_root / "_shared"
    skills_dir = project_root / "skills"

    if not shared_dir.exists():
        print(f"Error: {shared_dir} does not exist.")
        return

    shared_files = list(shared_dir.glob("*.md"))
    if not shared_files:
        print("No markdown files found in _shared/")
        return

    if not skills_dir.exists():
        print("skills/ directory does not exist or is empty.")
        return

    skill_dirs = [d for d in skills_dir.iterdir() if d.is_dir()]
    if not skill_dirs:
        print("No skill directories found under skills/")
        return

    synced_count = 0
    for skill_dir in skill_dirs:
        ref_dir = skill_dir / "references"
        ref_dir.mkdir(parents=True, exist_ok=True)
        for sfile in shared_files:
            content = sfile.read_text(encoding="utf-8")
            vendored_content = HEADER + content
            target_path = ref_dir / sfile.name
            target_path.write_text(vendored_content, encoding="utf-8")
            synced_count += 1
            print(f"Synced {sfile.name} -> {target_path.relative_to(project_root)}")

    print(f"\nSuccessfully synced {synced_count} file(s) across {len(skill_dirs)} skill(s).")

if __name__ == "__main__":
    sync_shared()
