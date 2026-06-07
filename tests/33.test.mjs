// https://github.com/denoland/deno/issues/33090

import test from 'node:test';
import assert from 'node:assert';
import http from 'node:http';

test('socket.bytesRead must exist and be numeric', async () => {
  const server = http.createServer((req, res) => {
    req.on('end', () => {
      const bytes = req.socket.bytesRead;

      assert.ok(typeof bytes === 'number');
      assert.ok(bytes > 0);

      res.end('ok');
      server.close();
    });

    req.resume();
  });

  await new Promise((r) => server.listen(0, r));

  const req = http.request({ port: server.address().port }, () => {});
  req.end('hello');
});