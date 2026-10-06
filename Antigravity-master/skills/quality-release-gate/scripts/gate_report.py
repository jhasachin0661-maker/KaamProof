#!/usr/bin/env python3
"""
Quality Release Gate Report Generator
Reads JSON array of check objects and renders a formatted markdown gate report.
Fails (exit code 1) if any check lacks evidence or if any check has FAILED status.
"""

import sys
import json
from pathlib import Path

VALID_STATUSES = {"VERIFIED", "NOT VERIFIED", "FAILED", "N/A", "REQUIRES HUMAN REVIEW"}

def render_gate_report(checks_data):
    if not isinstance(checks_data, list):
        raise ValueError("Input JSON must be a list of check objects")

    report_lines = [
        "# Quality Release Gate Audit Report",
        "",
        "| Group | Check Name | Status | Evidence |",
        "|---|---|---|---|"
    ]

    has_missing_evidence = False
    has_failed_check = False

    for idx, item in enumerate(checks_data):
        group = item.get("group", "General")
        name = item.get("name", f"Check #{idx+1}")
        status = item.get("status", "NOT VERIFIED").upper()
        evidence = item.get("evidence", "").strip()

        if status not in VALID_STATUSES:
            status = "NOT VERIFIED"

        if not evidence:
            has_missing_evidence = True
            evidence = "ERROR: Missing evidence citation"

        if status == "FAILED":
            has_failed_check = True

        report_lines.append(f"| {group} | {name} | **{status}** | {evidence} |")

    report_lines.append("")
    if has_failed_check or has_missing_evidence:
        report_lines.append("## Gate Verdict: INCOMPLETE / FAILED")
    else:
        report_lines.append("## Gate Verdict: PASSED")

    report_lines.append("")
    return "\n".join(report_lines), has_missing_evidence or has_failed_check

def main():
    if len(sys.argv) > 1:
        input_path = Path(sys.argv[1])
        if not input_path.exists():
            print(f"Error: Input file {input_path} not found.", file=sys.stderr)
            sys.exit(1)
        raw_json = input_path.read_text(encoding="utf-8")
    else:
        raw_json = sys.stdin.read()

    try:
        checks_data = json.loads(raw_json)
    except Exception as e:
        print(f"Error parsing JSON input: {e}", file=sys.stderr)
        sys.exit(1)

    report_md, is_failing = render_gate_report(checks_data)
    print(report_md)

    if is_failing:
        sys.exit(1)
    sys.exit(0)

if __name__ == "__main__":
    main()
