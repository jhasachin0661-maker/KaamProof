# Workflow: Security Audit

**Instruction to Agent:** Adopt the `dev-orchestrator` skill and execute the following plan template to perform a security audit.

## Plan Template

1. **secure-coding**: Audit the codebase for secure coding practices (`security-secure-coding`).
2. **scanning**: Run automated security scanning tools, limiting scope strictly to localhost or owned targets (`security-scanning`). This is a defensive operation only.
3. **threat notes**: Develop threat models or review existing ones (`security-threat-modeling`). Compile findings into a consolidated security audit report.
