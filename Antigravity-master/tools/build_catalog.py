#!/usr/bin/env python3
"""
Generates CATALOG.md from skills located in skills/
"""

import re
import yaml
from pathlib import Path

INVENTORY_MAP = {
    "dev-orchestrator": "S01",
    "core-repo-discovery": "S02",
    "core-requirements-planning": "S03",
    "core-implementation": "S04",
    "core-debugging": "S05",
    "core-research": "S06",
    "core-refactoring": "S07",
    "core-dependency-management": "S08",
    "config-env-secrets": "S09",
    "arch-system-design": "S10",
    "product-strategy": "S11",
    "uiux-research-flows": "S12",
    "uiux-visual-design": "S13",
    "uiux-interaction-motion": "S14",
    "uiux-design-critique": "S15",
    "frontend-web-app": "S16",
    "frontend-accessibility": "S17",
    "backend-service": "S18",
    "api-design": "S19",
    "database-design": "S20",
    "database-migrations-orm": "S21",
    "auth-authentication": "S22",
    "auth-authorization": "S23",
    "security-secure-coding": "S24",
    "security-threat-modeling": "S25",
    "security-scanning": "S26",
    "testing-engineering": "S27",
    "testing-e2e-browser": "S28",
    "git-workflow": "S29",
    "devops-ci-cd": "S30",
    "devops-containers": "S31",
    "devops-iac-kubernetes": "S32",
    "release-management": "S33",
    "cloud-deployment": "S34",
    "ops-observability": "S35",
    "perf-engineering": "S36",
    "seo-technical": "S37",
    "docs-engineering": "S38",
    "mobile-app": "S39",
    "desktop-app": "S40",
    "app-cli-extension-automation": "S41",
    "ai-llm-integration": "S42",
    "ai-rag-search": "S43",
    "ai-agent-systems": "S44",
    "ai-vision-ml": "S45",
    "data-pipelines-analytics": "S46",
    "quality-code-review": "S47",
    "quality-release-gate": "S48",
    "meta-skill-maintenance": "S49"
}

def build_catalog():
    project_root = Path(__file__).resolve().parent.parent
    skills_dir = project_root / 'skills'
    catalog_file = project_root / 'CATALOG.md'

    skills_data = []

    if skills_dir.exists():
        for skill_dir in sorted(skills_dir.iterdir()):
            if skill_dir.is_dir():
                skill_md = skill_dir / 'SKILL.md'
                if skill_md.exists():
                    content = skill_md.read_text(encoding='utf-8')
                    match = re.match(r'^---\n(.*?)\n---', content, re.DOTALL)
                    if match:
                        try:
                            fm = yaml.safe_load(match.group(1))
                            if isinstance(fm, dict):
                                name = fm.get('name', skill_dir.name)
                                desc = fm.get('description', '').replace('\n', ' ')
                                meta = fm.get('metadata', {}) if isinstance(fm.get('metadata'), dict) else {}
                                category = meta.get('category', '')
                                priority = meta.get('priority', '')
                                skill_id = INVENTORY_MAP.get(name, 'S--')
                                skills_data.append({
                                    'id': skill_id,
                                    'name': name,
                                    'category': category,
                                    'priority': priority,
                                    'description': desc
                                })
                        except Exception as e:
                            print(f"Warning: Failed to parse {skill_md}: {e}")

    # Build CATALOG.md content
    lines = [
        "# Antigravity Skill Catalog",
        "",
        "| ID | Name | Category | Priority | Description |",
        "|---|---|---|---|---|"
    ]

    if not skills_data:
        lines.append("| - | (No skills currently installed in skills/) | - | - | - |")
    else:
        # Sort by ID if available, else by name
        skills_data.sort(key=lambda x: (x['id'] if x['id'] != 'S--' else 'S99', x['name']))
        for item in skills_data:
            lines.append(f"| {item['id']} | {item['name']} | {item['category']} | {item['priority']} | {item['description']} |")

    lines.append("")
    catalog_file.write_text("\n".join(lines), encoding='utf-8')
    print(f"CATALOG.md successfully generated with {len(skills_data)} skill entry(ies).")

if __name__ == "__main__":
    build_catalog()
