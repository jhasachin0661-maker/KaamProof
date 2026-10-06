# RBAC vs ABAC Authorization Patterns

## Role-Based Access Control (RBAC)
Maps permissions to roles, and roles to users.

```json
{
  "roles": {
    "admin": ["users:read", "users:write", "org:delete"],
    "editor": ["users:read", "content:write"],
    "viewer": ["users:read"]
  }
}
```

### Server Middleware Pattern
```javascript
function authorize(requiredPermission) {
  return (req, res, next) => {
    if (!req.user || !req.user.permissions.includes(requiredPermission)) {
      return res.status(403).json({ error: "Forbidden: insufficient permissions" });
    }
    next();
  };
}
```

## Attribute-Based Access Control (ABAC)
Evaluates dynamic rules based on Subject (user), Resource (target), Action, and Environment attributes.

```javascript
function canEditDocument(user, document, environment) {
  if (user.role === 'admin') return true;
  if (document.ownerId === user.id && document.status === 'draft') return true;
  if (environment.isBusinessHours && user.department === document.department) return true;
  return false;
}
```
