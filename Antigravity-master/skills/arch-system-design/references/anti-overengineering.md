# Anti-Overengineering Guidelines

## Red Flags & Anti-Patterns
- **Premature Microservices**: Breaking a single-developer or 3-person team project into 8 microservices with gRPC and Service Mesh.
- **Distributed Monolith**: Microservices that share databases, synchronous HTTP chains, or require synchronized deployments.
- **Over-Abstraction**: Introducing generic factory-of-factories or complex plugin frameworks for features needed only once.
- **Resume-Driven Development**: Selecting complex distributed databases (e.g. Cassandra, Kafka) when PostgreSQL easily handles the load.

## Simplicity Rules
1. **YAGNI (You Aren't Gonna Need It)**: Implement only what is required now and for immediate 12-month projections.
2. **Default to Monolith**: Start monolith/modular monolith first; decompose into microservices ONLY when organizational or scaling bottlenecks are proven empirically.
3. **Keep Data Local**: Maintain single-database transactions as long as possible before introducing distributed transactions or saga patterns.
