#!/usr/bin/env python3
"""
Ecosystem Linter for Antigravity Dev Skills
"""

import sys
import os
import re
import json
import yaml
from pathlib import Path

ALLOWED_FRONTMATTER_PROPERTIES = {
    'name', 'description', 'license', 'allowed-tools', 'metadata', 'compatibility'
}

REQUIRED_METADATA_KEYS = {
    'category', 'priority', 'version', 'reads_from', 'risk_max'
}

def validate_skill_directory(skill_dir):
    errors = []
    warnings = []
    skill_dir = Path(skill_dir)
    skill_name = skill_dir.name

    skill_md = skill_dir / 'SKILL.md'
    if not skill_md.exists():
        return skill_name, ["SKILL.md not found"], []

    content = skill_md.read_text(encoding='utf-8')
    if not content.startswith('---'):
        errors.append("No YAML frontmatter found (must start with '---')")
        return skill_name, errors, warnings

    match = re.match(r'^---\n(.*?)\n---', content, re.DOTALL)
    if not match:
        errors.append("Invalid frontmatter format (missing closing '---')")
        return skill_name, errors, warnings

    frontmatter_text = match.group(1)
    body_text = content[match.end():]

    # Parse YAML
    try:
        frontmatter = yaml.safe_load(frontmatter_text)
        if not isinstance(frontmatter, dict):
            errors.append("Frontmatter must be a YAML dictionary")
            return skill_name, errors, warnings
    except yaml.YAMLError as e:
        errors.append(f"Invalid YAML in frontmatter: {e}")
        return skill_name, errors, warnings

    # Allowed keys check
    unexpected_keys = set(frontmatter.keys()) - ALLOWED_FRONTMATTER_PROPERTIES
    if unexpected_keys:
        errors.append(
            f"Unexpected key(s) in SKILL.md frontmatter: {', '.join(sorted(unexpected_keys))}. "
            f"Allowed properties are: {', '.join(sorted(ALLOWED_FRONTMATTER_PROPERTIES))}"
        )

    # Name validation
    if 'name' not in frontmatter:
        errors.append("Missing 'name' in frontmatter")
        fm_name = ""
    else:
        fm_name = frontmatter['name']
        if not isinstance(fm_name, str):
            errors.append(f"Name must be a string, got {type(fm_name).__name__}")
            fm_name = ""
        else:
            fm_name = fm_name.strip()
            if fm_name != skill_name:
                errors.append(f"Directory name '{skill_name}' does not match frontmatter name '{fm_name}'")

            if not re.match(r'^[a-z0-9-]+$', fm_name):
                errors.append(f"Name '{fm_name}' must be kebab-case (lowercase letters, digits, hyphens)")
            if fm_name.startswith('-') or fm_name.endswith('-') or '--' in fm_name:
                errors.append(f"Name '{fm_name}' cannot start/end with hyphen or contain consecutive hyphens")
            if len(fm_name) > 64:
                errors.append(f"Name is too long ({len(fm_name)} chars, max 64)")

    # Description validation
    if 'description' not in frontmatter:
        errors.append("Missing 'description' in frontmatter")
    else:
        desc = frontmatter['description']
        if not isinstance(desc, str):
            errors.append(f"Description must be a string, got {type(desc).__name__}")
        else:
            desc = desc.strip()
            if '<' in desc or '>' in desc:
                errors.append("Description cannot contain angle brackets (< or >)")
            if len(desc) > 1024:
                errors.append(f"Description exceeds hard cap of 1024 chars ({len(desc)} chars)")
            elif len(desc) > 450:
                warnings.append(f"Description is {len(desc)} chars (recommended <= 450 chars)")

    # Compatibility validation if present
    if 'compatibility' in frontmatter:
        comp = frontmatter['compatibility']
        if not isinstance(comp, str):
            errors.append(f"Compatibility must be a string, got {type(comp).__name__}")
        elif len(comp) > 500:
            errors.append(f"Compatibility is too long ({len(comp)} chars, max 500)")

    # Metadata check
    if 'metadata' not in frontmatter:
        errors.append("Missing 'metadata' block in frontmatter")
    else:
        meta = frontmatter['metadata']
        if not isinstance(meta, dict):
            errors.append("Metadata must be a dictionary")
        else:
            missing_meta_keys = REQUIRED_METADATA_KEYS - set(meta.keys())
            if missing_meta_keys:
                errors.append(f"Metadata missing required key(s): {', '.join(sorted(missing_meta_keys))}")

    # Body line count check (< 500 lines)
    body_lines = body_text.strip().splitlines()
    if len(body_lines) >= 500:
        errors.append(f"SKILL.md body must be < 500 lines (found {len(body_lines)} lines)")

    # Check backticked references/ and scripts/ paths
    backtick_paths = re.findall(r'`((?:references|scripts)/[^`]+)`', content)
    for raw_path in backtick_paths:
        clean_path = raw_path.split('#')[0].strip()
        target = skill_dir / clean_path
        if not target.exists():
            errors.append(f"Referenced path '{clean_path}' in SKILL.md does not exist")

    # Evals check: evals/evals.json exists and uses expectations field
    evals_file = skill_dir / 'evals' / 'evals.json'
    if not evals_file.exists():
        errors.append("evals/evals.json does not exist")
    else:
        try:
            evals_data = json.loads(evals_file.read_text(encoding='utf-8'))
            if not isinstance(evals_data, dict) or 'evals' not in evals_data or not isinstance(evals_data['evals'], list):
                errors.append("evals/evals.json must be a JSON object containing an 'evals' array")
            else:
                for idx, item in enumerate(evals_data['evals']):
                    if not isinstance(item, dict) or 'expectations' not in item:
                        errors.append(f"evals/evals.json item #{idx+1} missing 'expectations' field")
        except json.JSONDecodeError as e:
            errors.append(f"Invalid JSON in evals/evals.json: {e}")

    return fm_name or skill_name, errors, warnings


def check_dependency_cycles(skills_metadata):
    """
    Builds a dependency graph from metadata.reads_from and checks for cycles.
    """
    graph = {}
    for name, reads_from in skills_metadata.items():
        deps = []
        if isinstance(reads_from, str) and reads_from.lower() != 'none':
            for dep in reads_from.split(','):
                dep = dep.strip()
                if dep and dep.lower() != 'none':
                    deps.append(dep)
        graph[name] = deps

    visited = {}  # 0: unvisited, 1: visiting, 2: visited
    cycles = []

    def dfs(node, path):
        visited[node] = 1
        path.append(node)
        for neighbor in graph.get(node, []):
            if neighbor in graph:
                if visited.get(neighbor, 0) == 1:
                    cycle_start = path.index(neighbor)
                    cycles.append(path[cycle_start:] + [neighbor])
                elif visited.get(neighbor, 0) == 0:
                    dfs(neighbor, path)
        path.pop()
        visited[node] = 2

    for node in graph:
        if visited.get(node, 0) == 0:
            dfs(node, [])

    return cycles


def lint_ecosystem():
    project_root = Path(__file__).resolve().parent.parent
    skills_dir = project_root / 'skills'

    print("==========================================")
    print(" ANTIGRAVITY DEV SKILL ECOSYSTEM LINTER")
    print("==========================================\n")

    if not skills_dir.exists():
        skills_dir.mkdir(parents=True, exist_ok=True)

    skill_dirs = [d for d in skills_dir.iterdir() if d.is_dir()]

    total_errors = 0
    total_warnings = 0
    results = []
    skills_metadata = {}

    for skill_dir in sorted(skill_dirs):
        name, errors, warnings = validate_skill_directory(skill_dir)
        total_errors += len(errors)
        total_warnings += len(warnings)
        results.append((name, errors, warnings))

        # Collect metadata for dependency graph
        skill_md = skill_dir / 'SKILL.md'
        if skill_md.exists():
            try:
                match = re.match(r'^---\n(.*?)\n---', skill_md.read_text(encoding='utf-8'), re.DOTALL)
                if match:
                    fm = yaml.safe_load(match.group(1))
                    if isinstance(fm, dict) and 'metadata' in fm and isinstance(fm['metadata'], dict):
                        skills_metadata[name] = fm['metadata'].get('reads_from', 'none')
            except Exception:
                pass

    # Dependency Cycle Check
    cycles = check_dependency_cycles(skills_metadata)
    cycle_errors = []
    if cycles:
        for cycle in cycles:
            cycle_str = " -> ".join(cycle)
            err_msg = f"Dependency cycle detected in metadata.reads_from: {cycle_str}"
            cycle_errors.append(err_msg)
            total_errors += 1

    # Print Results Table
    print(f"{'Skill Name':<32} | {'Status':<8} | {'Errors':<6} | {'Warnings':<8}")
    print("-" * 65)

    if not results:
        print(f"{'(empty skills/ directory)':<32} | {'PASS':<8} | {0:<6} | {0:<8}")
    else:
        for name, errors, warnings in results:
            status = "FAIL" if errors else "PASS"
            print(f"{name:<32} | {status:<8} | {len(errors):<6} | {len(warnings):<8}")
            for err in errors:
                print(f"  [ERROR] {err}")
            for warn in warnings:
                print(f"  [WARN]  {warn}")

    if cycle_errors:
        print("\n--- DEPENDENCY GRAPH ERRORS ---")
        for err in cycle_errors:
            print(f"  [ERROR] {err}")

    print("-" * 65)
    print(f"Summary: {len(skill_dirs)} skill(s) checked. Total Errors: {total_errors}, Total Warnings: {total_warnings}.\n")

    if total_errors > 0:
        print("RESULT: LINT FAILED")
        sys.exit(1)
    else:
        print("RESULT: LINT PASSED")
        sys.exit(0)

if __name__ == "__main__":
    lint_ecosystem()
