# Attack Surface & Data Flow Diagrams (DFD)

## DFD Elements
1. **External Entities**: Users, Third-party APIs, Mobile Clients.
2. **Processes**: Web Controllers, Microservices, Worker Nodes.
3. **Data Stores**: PostgreSQL, Redis, S3 Buckets.
4. **Data Flows**: HTTP requests, gRPC calls, Database connections.
5. **Trust Boundaries**: Perimeter crossing between untrusted internet and trusted internal network.

## Attack Surface Reduction Principles
- **Minimize Entry Points**: Close unneeded open ports; expose backend microservices only via internal network / VPC.
- **Input Validation**: Treat all incoming payload data from outside trust boundaries as untrusted.
- **Disable Legacy Features**: Remove unneeded endpoints, legacy v1 APIs, and debug endpoints in production.
