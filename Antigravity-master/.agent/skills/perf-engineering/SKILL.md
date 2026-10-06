---
name: perf-engineering
description: Profile, benchmark, and optimize performance across frontend, backend, database, and caching/CDN layers. Enforce mandatory baseline measurement BEFORE and AFTER edits. Trigger whenever optimizing bundle sizes, profiling CPU/memory, tuning SQL queries, analyzing Core Web Vitals, or running load tests, even if perf engineering is not named.
metadata:
  category: perf
  priority: P1
  layer: verify
  version: 0.1.0
  reads_from: core-repo-discovery
  risk_max: MEDIUM
---

# Performance Engineering

## Purpose
Systematically profile, benchmark, and optimize software performance across frontend (Lighthouse, Core Web Vitals, bundle size, code splitting), backend (CPU/memory profiling, concurrency, async I/O), database (EXPLAIN ANALYZE query plans, indexing), API latency, CDN caching, and load/stress testing. Absolute Core Rule: ALWAYS MEASURE BEFORE AND AFTER. Never claim an optimization without empirical baseline and post-edit numbers.

## When NOT to use
- Do not use for general functional bug fixes without performance degradation (use `core-debugging`).
- Do not use for security vulnerability patching (use `security-secure-coding`).

## Inputs
- Application codebase, profiling outputs, performance audit reports, `.agent/context/project-context.json`.

## Procedure
1. **Measurement Protocol (BEFORE)**:
   - Establish baseline metrics BEFORE making any code edits following `references/measurement-protocol.md`. Record baseline P95/P99 latency, RPS, memory footprint, bundle size, or Core Web Vitals (LCP, CLS, INP).
2. **Frontend Optimization**:
   - Optimize bundle size, lazy loading, image compression, and code splitting per `references/frontend.md`.
3. **Backend Profiling & Concurrency**:
   - Profile CPU/memory hotspots, event loop lag, and connection pools per `references/backend.md`.
4. **Database Query Tuning**:
   - Analyze slow query logs using `EXPLAIN ANALYZE`. Add targeted indexes or refactor N+1 queries per `references/database.md`.
5. **Caching & CDN Acceleration**:
   - Implement HTTP cache-control headers, Redis/Memcached key caching, and edge CDN rules per `references/caching-cdn.md`.
6. **Load & Stress Testing**:
   - Execute load tests using `k6`, `autocannon`, or `locust` per `references/load-testing.md`.
7. **Verification Measurement (AFTER)**:
   - Re-run benchmark under identical conditions. Verify empirical improvement percentage (e.g. "Latency reduced by 42% from 180ms to 104ms P95").

## Validation
- Baseline metrics recorded BEFORE code modifications.
- Post-optimization metrics recorded under identical test harness AFTER code modifications.
- Empirical performance gain proven with comparative numbers (exit code 0).

## Failure handling
- If an attempted optimization degrades performance or causes regressions, immediately revert the change (`git checkout`), record the negative metric delta, and investigate alternate bottlenecks.

## Approval touchpoints
- Refer to `references/approval-levels.md`.
- `MEDIUM`: Applying code optimizations, adding database indexes, modifying caching policies, running load tests.

## Output
- Handoff file in `.agent/context/handoffs/NN-perf-engineering.md` per `references/output-contract.md`.
- Performance Report detailing BEFORE vs AFTER benchmark metrics, CPU/memory profiles, and applied code/index changes.

## References index
- `references/measurement-protocol.md`: Mandatory baseline protocol, metric recording, and comparative measurement rules.
- `references/frontend.md`: Core Web Vitals, bundle optimization, tree-shaking, images, and code splitting.
- `references/backend.md`: CPU/memory profiling, event loop non-blocking async, and thread pool tuning.
- `references/database.md`: EXPLAIN ANALYZE query plan evaluation, index design, and N+1 query elimination.
- `references/caching-cdn.md`: Redis caching patterns, Cache-Control headers, and CDN invalidation.
- `references/load-testing.md`: Load and stress testing with k6, autocannon, and concurrency scenarios.
- `references/context-contract.md`: Schema for project context.
- `references/output-contract.md`: Standard handoff output structure.
- `references/approval-levels.md`: Operational risk levels.
- `references/untrusted-content.md`: Untrusted content handling rules.
