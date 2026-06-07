// https://github.com/denoland/deno/issues/33090

import { test } from 'node:test';
import assert from 'node:assert';
import http from 'node:http';

test('IncomingMessage.socket.bytesRead should report incoming data metrics (Runtime Parity)', () => {
  return new Promise((resolve, reject) => {
    let server;
    const timeoutId = setTimeout(() => {
      if (server) server.close();
      reject(new Error('Test timed out: HTTP request pipeline failed to complete or respond.'));
    }, 2000);

    // 1. Create a baseline HTTP server
    server = http.createServer((req, res) => {
      req.on('end', () => {
        clearTimeout(timeoutId);

        try {
          const bytes = req.socket.bytesRead;

          // Deno fails here because bytes evaluates to undefined
          assert.notStrictEqual(
            bytes,
            undefined,
            'BUG detected: req.socket.bytesRead is undefined.'
          );

          assert.strictEqual(
            typeof bytes,
            'number',
            `Expected bytesRead to be a number metric, got: ${typeof bytes}`
          );

          // The metric should be at least greater than the raw payload length 
          // because it includes the serialized HTTP transport header tokens.
          assert.ok(
            bytes > 5,
            `Expected bytesRead (${bytes}) to include HTTP header envelopes alongside the 5-byte payload.`
          );

          res.end('ok');
          server.close(() => resolve());
        } catch (err) {
          res.end('fail');
          server.close(() => reject(err));
        }
      });
      
      req.resume();
    });

    // 2. Bind to an ephemeral port assigned dynamically by the OS
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();

      // 3. Dispatch a PUT request containing a 5-byte payload string
      const clientReq = http.request({
        host: '127.0.0.1',
        port: port,
        method: 'PUT',
        headers: {
          'Connection': 'close'
        }
      });

      clientReq.on('error', (err) => {
        clearTimeout(timeoutId);
        server.close(() => reject(err));
      });

      clientReq.write('hello');
      clientReq.end();
    });
  });
});