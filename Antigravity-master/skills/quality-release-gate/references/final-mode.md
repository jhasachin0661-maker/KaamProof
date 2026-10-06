# Quality Release Gate — Final-Mode Protocol

## Execution Protocol
Final-mode is invoked prior to releasing software or declaring the task fully complete.

### Final-Mode Rules
1. Execute full check matrix across all 7 categories (Code, Security, UI, Backend, Database, Deployment, Docs).
2. Validate end-to-end build, full test suite execution, and comprehensive linter passes.
3. Verify documentation completeness (README updates, environment variable additions, API spec alignment).
4. Assign statuses (`VERIFIED`, `NOT VERIFIED`, `FAILED`, `N/A`, `REQUIRES HUMAN REVIEW`).
5. Render full audit report using `scripts/gate_report.py`.
6. Any `FAILED` status halts release and marks completion as FALSE.
