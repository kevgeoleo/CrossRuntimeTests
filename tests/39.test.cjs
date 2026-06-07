// https://github.com/oven-sh/bun/issues/28749

const test = require('node:test');
const assert = require('node:assert');
const http = require('node:http');

test('http expect: 100-continue should reach response and close cleanly', async () => {
  const server = http.createServer((req, res) => {
    res.end();
  });

  await new Promise((resolve) => server.listen(9090, resolve));

  const req = http.request('http://localhost:9090/', {
    headers: {
      expect: '100-continue',
    },
  });

  let gotContinue = false;
  let gotResponse = false;

  req.on('continue', () => {
    gotContinue = true;
  });

  req.on('response', () => {
    gotResponse = true;
  });

  const result = await new Promise((resolve, reject) => {
    req.on('error', reject);

    // fail-safe timeout so Bun doesn't hang forever
    const t = setTimeout(() => {
      reject(new Error('timeout waiting for response event'));
    }, 2000);

    req.on('response', (res) => {
      res.on('data', () => {});
      res.on('end', () => {
        clearTimeout(t);
        resolve(true);
      });
    });
  });

  await new Promise((resolve, reject) =>
    server.close((err) => (err ? reject(err) : resolve()))
  );

  assert.strictEqual(gotContinue, true, 'Expected continue event');
  assert.strictEqual(gotResponse, true, 'Expected response event');
  assert.strictEqual(result, true);
});