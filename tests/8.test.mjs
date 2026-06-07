// https://github.com/oven-sh/bun/issues/23970

import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';

const PORT = 8123;

test('HTTP server receives headers and body correctly', async () => {
  const server = http.createServer((req, res) => {
    assert.ok(
      req.headers && Object.keys(req.headers).length > 0,
      'BUG: Request headers were not received'
    );

    let body = '';

    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', () => {
      assert.strictEqual(
        body,
        'hello',
        `BUG: Expected body "hello" but got "${body}"`
      );

      res.statusCode = 200;
      res.end('OK');
    });
  });

  await new Promise((resolve, reject) => {
    server.listen(PORT, 'localhost', (err) => {
      if (err) reject(err);

      const req = http.request(
        {
          hostname: 'localhost',
          port: PORT,
          path: '/',
          method: 'POST',
        },
        (res) => {
          res.resume();
          res.on('end', () => {
            server.close(resolve);
          });
        }
      );

      req.on('error', reject);

      req.write('hello');
      req.end();
    });
  });
});

/*import http from "node:http";
import assert from "node:assert/strict";

const PORT = 8123;

const server = http.createServer((req, res) => {
  // ✅ ASSERT headers must exist
  assert.ok(
    req.headers && Object.keys(req.headers).length > 0,
    "BUG: Request headers were not received"
  );

  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    // ✅ ASSERT body must equal what was sent
    assert.strictEqual(
      body,
      "hello",
      `BUG: Expected body "hello" but got "${body}"`
    );

    res.statusCode = 200;
    res.end("OK");
  });
});

server.listen(PORT, "localhost", () => {
  const req = http.request(
    {
      hostname: "localhost",
      port: PORT,
      path: "/",
      method: "POST",
    },
    (res) => {
      res.resume();
      res.on("end", () => {
        server.close(() => {
          console.log("OK");
        });
      });
    }
  );

  // ✅ Only ONE chunk
  req.write("hello");
  req.end();
});*/