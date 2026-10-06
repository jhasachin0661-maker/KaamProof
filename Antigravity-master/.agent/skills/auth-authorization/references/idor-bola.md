# Preventing IDOR and BOLA Vulnerabilities

## Insecure Direct Object Reference (IDOR) / Broken Object Level Authorization (BOLA)
Vulnerability occurs when an API accepts a user-provided resource ID without verifying that the authenticated user owns or has access to that specific object.

## VULNERABLE CODE EXAMPLE
```javascript
// BAD: Accepts resource ID directly without checking ownership
app.get('/api/orders/:id', async (req, res) => {
  const order = await db.orders.findById(req.params.id);
  res.json(order);
});
```

## SECURE CODE PATTERNS

### Pattern 1: Scoped Database Queries
```javascript
// GOOD: Always scoping query to authenticated user / tenant ID
app.get('/api/orders/:id', async (req, res) => {
  const order = await db.orders.findOne({
    _id: req.params.id,
    userId: req.user.id // Enforces ownership at DB layer
  });
  if (!order) {
    return res.status(404).json({ error: "Order not found or access denied" });
  }
  res.json(order);
});
```

### Pattern 2: Server-side Policy Enforcement
```javascript
const order = await db.orders.findById(req.params.id);
if (!order || order.tenantId !== req.user.tenantId) {
  return res.status(403).json({ error: "Access denied" });
}
```
