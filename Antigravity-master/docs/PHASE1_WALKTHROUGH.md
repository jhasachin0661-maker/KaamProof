# Phase 1 Walkthrough — Manual Skill Sequence Execution

This walkthrough guides you through executing the core Antigravity skill sequence on a small change in the sample application `examples/hello-api/`.

## Target Skill Sequence
`dev-orchestrator` -> `core-repo-discovery` -> `core-implementation` -> `testing-engineering` -> `security-secure-coding` -> `quality-release-gate`

---

## Step-by-Step Execution Sequence

### 1. Orchestrate Task (`dev-orchestrator`)
- **Action**: Initiate task requirement: "Add a GET /api/v1/version endpoint to return API version 1.0.0".
- **Execution**: The orchestrator checks `.agent/context/project-context.json`. If missing, it invokes `core-repo-discovery` first.
- **Output Artifacts to Expect**:
  - `.agent/context/plan.md` created with step slices.
  - Handoff file `.agent/context/handoffs/01-dev-orchestrator.md`.
- **What to Verify**:
  - Check `.agent/context/plan.md` contains vertical slice entries mapping steps to skills.
  - Verify risk levels assigned to each slice (`LOW` for adding new endpoint).

### 2. Context & Repo Discovery (`core-repo-discovery`)
- **Action**: Inspect project structure, dependencies, package manager, and test runner.
- **Execution**: Runs file inspection across `examples/hello-api/`.
- **Output Artifacts to Expect**:
  - Populated `.agent/context/project-context.json`.
  - Handoff file `.agent/context/handoffs/02-core-repo-discovery.md`.
- **What to Verify**:
  - Verify `stack.language` includes `javascript` or `node`.
  - Verify `commands.test` contains `{"cmd": "npm test", "verified": false}`.

### 3. Implementation (`core-implementation`)
- **Action**: Add `GET /api/v1/version` endpoint to `examples/hello-api/app.js`.
- **Execution**: Modify `app.js` using smallest safe diff matching route export conventions.
- **Output Artifacts to Expect**:
  - Updated `examples/hello-api/app.js`.
  - Handoff file `.agent/context/handoffs/03-core-implementation.md`.
- **What to Verify**:
  - Verify route `app.get('/api/v1/version', ...)` returns `{ version: '1.0.0' }`.
  - Check that existing routes (`/api/v1/health`, `/api/v1/hello`) are preserved without side-effects.

### 4. Testing (`testing-engineering`)
- **Action**: Add a unit test for `/api/v1/version` in `examples/hello-api/app.test.js` and run tests.
- **Execution**: Run test command `npm test`.
- **Output Artifacts to Expect**:
  - Updated `examples/hello-api/app.test.js`.
  - Handoff file `.agent/context/handoffs/04-testing-engineering.md`.
- **What to Verify**:
  - Run `npm test` manually in terminal and verify exit code 0.
  - Verify test assertion checks `res.jsonData.version === '1.0.0'`.

### 5. Security Review (`security-secure-coding`)
- **Action**: Audit changed files in diff against OWASP Top 10 checklist.
- **Execution**: Inspect route parameter handling, security headers, input validation, and secret exposure.
- **Output Artifacts to Expect**:
  - Security audit report in `.agent/context/handoffs/05-security-secure-coding.md`.
- **What to Verify**:
  - Verify no unhandled input injection or secret leaks in new endpoint.
  - Check that findings list includes file:line references for all audited files.

### 6. Quality Release Gate (`quality-release-gate`)
- **Action**: Execute final-mode release gate audit across Code, Security, UI, Backend, DB, Deployment, and Docs categories.
- **Execution**: Run `python skills/quality-release-gate/scripts/gate_report.py` on compiled check JSON.
- **Output Artifacts to Expect**:
  - Gate audit report in `.agent/context/handoffs/06-quality-release-gate.md`.
- **What to Verify**:
  - Check that every check status (`VERIFIED`, `N/A`, `REQUIRES HUMAN REVIEW`, `FAILED`) is backed by evidence or rationale.
  - Verify final verdict: `PASSED` or `INCOMPLETE`.
