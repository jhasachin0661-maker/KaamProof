# Architecture Decision Matrix

| Pattern | Ideal Team Size | Ops Complexity | Scale Flexibility | Best Used For |
|---|---|---|---|---|
| **Monolith** | 1 - 5 engineers | Low | Vertical / Basic horizontal | Early stage MVPs, single domain apps, rapid initial delivery |
| **Modular Monolith** | 5 - 20 engineers | Low-Medium | High code boundary separation | Growing products, domain isolation without network latency |
| **Microservices** | 20+ engineers | High | Independent per-service scaling | Large organizations with autonomous domain teams |
| **Serverless** | Any | Low (cloud-managed) | Event-driven burst scale | Utility workloads, asynchronous jobs, fluctuating traffic |
| **Event-Driven** | Any | Medium-High | Asynchronous decoupled processing | Real-time streams, multi-system notification/audit pipelines |
| **Layered / Clean / Hexagonal** | 3+ engineers | Low-Medium | High testability & domain isolation | Core domain business logic with pluggable DB/UI adapters |

## Selection Rules
1. If team size < 10 and throughput < 10k RPS -> Modular Monolith or Monolith.
2. If workload is purely event-driven/ephemeral -> Serverless functions.
3. If high domain isolation & testability required -> Clean / Hexagonal architecture within a Modular Monolith.
