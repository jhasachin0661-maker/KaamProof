# Multi-Tenancy Data Isolation

## Strategies

### 1. Column-Based Multi-Tenancy (Discriminator Column)
- Every table includes a `tenant_id` column.
- Server middleware automatically extracts `tenant_id` from validated session/token and attaches it to context.
- Database queries and ORM hooks automatically append `WHERE tenant_id = current_tenant`.

### 2. Schema-per-Tenant
- Each tenant resides in a distinct SQL database schema.
- Database connection pool switches search path dynamically based on context.

### 3. Database-per-Tenant
- Physical isolation of database instances. Required for high-compliance healthcare/finance tenants.

## Security Checklist
- [ ] Never accept `tenant_id` as a client-provided URL query or POST body parameter.
- [ ] Verify background job queues carry tenant context explicitly.
- [ ] Ensure cross-tenant data leaks trigger alert logging.
