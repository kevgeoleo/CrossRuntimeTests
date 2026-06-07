// https://github.com/oven-sh/bun/issues/28641
// works only in linux

import test from 'node:test';
import assert from 'node:assert';
import http from 'node:http';

test('HTTP header overflow allows server response (Node semantics)', async () => {
  const PORT = 0;

  const server = http.createServer((req, res) => {
    res.end('ok');
  });

  let clientErrorSeen = false;
  let responded = false;

  server.on('clientError', (err, socket) => {
    if (err.code === 'HPE_HEADER_OVERFLOW') {
      clientErrorSeen = true;

      try {
        socket.end(
          'HTTP/1.1 431 Request Header Fields Too Large\r\n' +
          'Connection: close\r\n\r\n'
        );
        responded = true;
      } catch (_) {}
    }
  });

  await new Promise(resolve => server.listen(0, resolve));
  const port = server.address().port;

  const hugeHeaderValue = 'a'.repeat(1024 * 64 * 2);

  const req = http.request({
    host: '127.0.0.1',
    port,
    method: 'GET',
    path: '/',
    headers: { 'X-Huge-Header': hugeHeaderValue }
  });

  const status = await new Promise((resolve, reject) => {
    req.on('response', res => resolve(res.statusCode));
    req.on('error', reject);
    req.end();
  });

  server.close();

  assert.strictEqual(clientErrorSeen, true);
  assert.strictEqual(responded, true);
  assert.strictEqual(status, 431);
});