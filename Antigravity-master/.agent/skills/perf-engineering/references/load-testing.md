# Load & Stress Testing Guidelines

## k6 Load Test Example

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 50 }, // Ramp-up to 50 users
    { duration: '1m', target: 50 },  // Stay at 50 users
    { duration: '10s', target: 0 },  // Ramp-down
  ],
  thresholds: {
    http_req_duration: ['p(95)<200'], // 95% of requests must complete within 200ms
  },
};

export default function () {
  const res = http.get('http://localhost:3000/api/v1/products');
  check(res, { 'status is 200': (r) => r.status === 200 });
  sleep(1);
}
```
