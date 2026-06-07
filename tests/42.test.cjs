// https://github.com/denoland/deno/issues/33135

const test = require('node:test');
const assert = require('node:assert');
const http = require('node:http');
const net = require('node:net');

test('chunked parser must terminate on malformed input', async () => {
  const server = http.createServer((req, res) => {
    req.on('data', () => {});
    req.on('end', () => res.end());
  });

  await new Promise((r) => server.listen(0, r));
  const port = server.address().port;

  let finished = false;

  await new Promise((resolve) => {
    const sock = net.createConnection(port, '127.0.0.1');

    const done = (reason) => {
      if (finished) return;
      finished = true;
      resolve(reason);
    };

    sock.once('error', () => done('error'));
    sock.once('close', () => done('close'));
    sock.once('end', () => done('end'));

    sock.once('connect', () => {
      sock.write(
        'POST / HTTP/1.1\r\n' +
        'Host: localhost\r\n' +
        'Transfer-Encoding: chunked\r\n' +
        '\r\n' +
        '3\r\nfoo\r\n' +
        '3\r\nbar\r\n' +
        'ff\r\n'
      );

      sock.destroy();
    });
  });

  server.close();

  assert.ok(finished, 'Socket must terminate on malformed chunked input');
}, { timeout: 8000 });