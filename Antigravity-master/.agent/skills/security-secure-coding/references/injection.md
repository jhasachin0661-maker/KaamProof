# Injection Prevention Guidelines

## SQL Injection (SQLi)
### Vulnerable Pattern
```javascript
// BAD: String concatenation in SQL query
const query = `SELECT * FROM users WHERE email = '${req.body.email}'`;
db.query(query);
```

### Remediation Pattern
```javascript
// GOOD: Parameterized query
const query = 'SELECT * FROM users WHERE email = $1';
db.query(query, [req.body.email]);
```

## Command Injection
### Vulnerable Pattern
```python
# BAD: Direct execution of user input in shell
import os
os.system(f"ping -c 1 {user_ip}")
```

### Remediation Pattern
```python
# GOOD: Subprocess with argument array and no shell evaluation
import subprocess
subprocess.run(["ping", "-c", "1", user_ip], check=True)
```

## NoSQL Injection
### Vulnerable Pattern
```javascript
// BAD: Passing unvalidated body directly to MongoDB query
db.users.find({ username: req.body.username, password: req.body.password });
// If req.body.password is { "$ne": null }, authentication is bypassed!
```

### Remediation Pattern
```javascript
// GOOD: Enforce type checking / sanitization
const username = String(req.body.username);
const password = String(req.body.password);
db.users.find({ username, password });
```
