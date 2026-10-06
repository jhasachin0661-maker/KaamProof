# Worked Example Plan: SaaS Task Manager

Objective: Build a SaaS Task Management Web Application with user auth, PostgreSQL database, and task dashboard.

- **Project Mode**: greenfield
- **Selected Profile**: SaaS Profile
- **Target Environment**: local

## Vertical Slices DAG

### Slice 1: Environment & Discovery
- **ID**: slice-01
- **Skill**: `core-repo-discovery`
- **Inputs**: Workspace root
- **Outputs**: `.agent/context/project-context.json`
- **Risk Level**: LOW
- **Parallel Safe**: false
- **Status**: done
- **Dependencies**: none

### Slice 2: Database Schema & Migrations
- **ID**: slice-02
- **Skill**: `database-migrations-orm`
- **Inputs**: `prisma/schema.prisma`
- **Outputs**: Database migration files
- **Risk Level**: CRITICAL
- **Parallel Safe**: false
- **Status**: todo
- **Dependencies**: slice-01
- **Approval Point**: CRITICAL risk approval required before running schema migration against local/dev database.

### Slice 3A: Backend API Services
- **ID**: slice-03a
- **Skill**: `backend-service`
- **Inputs**: `src/server/trpc/routers/task.ts`
- **Outputs**: API endpoints for Task CRUD
- **Risk Level**: MEDIUM
- **Parallel Safe**: true (parallel branch A)
- **Status**: todo
- **Dependencies**: slice-02

### Slice 3B: UI & Dashboard Layout
- **ID**: slice-03b
- **Skill**: `uiux-visual-design`
- **Inputs**: `src/components/TaskBoard.tsx`
- **Outputs**: Frontend Dashboard components
- **Risk Level**: LOW
- **Parallel Safe**: true (parallel branch B)
- **Status**: todo
- **Dependencies**: slice-01

### Slice 4: Authentication & Security
- **ID**: slice-04
- **Skill**: `auth-authentication`
- **Inputs**: NextAuth configuration, session middleware
- **Outputs**: Auth routes & session management
- **Risk Level**: CRITICAL
- **Parallel Safe**: false
- **Status**: todo
- **Dependencies**: slice-03a, slice-03b
- **Approval Point**: CRITICAL risk approval required for auth configuration and token management.

### Slice 5: Quality & Release Gate
- **ID**: slice-05
- **Skill**: `quality-release-gate`
- **Inputs**: Full repository diff
- **Outputs**: Final verification status report
- **Risk Level**: LOW
- **Parallel Safe**: false
- **Status**: todo
- **Dependencies**: slice-04
