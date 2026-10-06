const test = require('node:test');
const assert = require('node:assert');
const app = require('./app');

test('GET /api/v1/health returns status ok', async () => {
  // Simple unit test verifying route handler logic
  const req = {};
  const res = {
    statusCode: null,
    jsonData: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.jsonData = data;
      return this;
    }
  };

  const healthHandler = app._router.stack
    .filter(r => r.route && r.route.path === '/api/v1/health')[0].route.stack[0].handle;

  healthHandler(req, res);

  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.jsonData.status, 'ok');
  assert.strictEqual(typeof res.jsonData.uptime, 'number');
});
