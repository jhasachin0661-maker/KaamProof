# PRD & Requirements Template (`requirements.md`)

## 1. Executive Summary & Intent
- **Project Name**: [Name]
- **Mode**: greenfield | existing
- **Data Sensitivity Flags**: PII | Payments / Billing | Authentication / Credentials | None

## 2. Functional Requirements (FR)
- **FR-01**: [Description of feature behavior]
- **FR-02**: [Description of feature behavior]

## 3. Non-Functional Requirements (NFR)
- **NFR-01 (Performance)**: [Latency, page load time, throughput targets]
- **NFR-02 (Security)**: [Authentication, transport encryption, secret handling]
- **NFR-03 (Accessibility)**: [WCAG 2.1 AA compliance]

## 4. Constraints & Boundaries
- Out-of-scope boundaries to prevent scope creep.
- Existing tech stack constraints from `.agent/context/project-context.json`.

## 5. Definition of Done (DoD)
- Clean build exit code (0).
- Automated tests passing with zero regressions.
- Security vulnerability check clean.
