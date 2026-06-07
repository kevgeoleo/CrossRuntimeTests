// https://github.com/oven-sh/bun/issues/29073

import test from 'node:test';
import assert from 'node:assert';
import http2 from 'node:http2';

test('HTTP/2 h2c server should respond to prior-knowledge request', async () => {
  const server = http2.createServer((req, res) => {
    res.setHeader("Content-Type", "text/html");
    res.setHeader("X-Foo", "bar");
    res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("ok");
    });

  await new Promise((r) => server.listen(0, r));
  const port = server.address().port;

  const client = http2.connect(`http://localhost:${port}`);

  const data = await new Promise((resolve, reject) => {
    const req = client.request({ ':path': '/' });

    let chunks = [];

    req.on('data', (c) => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks).toString()));
    req.on('error', reject);

    req.end();
  });

  assert.strictEqual(data, 'ok');

  client.close();
  server.close();
});