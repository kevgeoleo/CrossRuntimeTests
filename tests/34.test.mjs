// https://github.com/oven-sh/bun/issues/28716

import test from 'node:test';
import assert from 'node:assert';
import http2 from 'node:http2';

test('HTTP2 connect with IP should establish session and expose originSet', (t, done) => {
  const session = http2.connect('https://1.1.1.1', { servername: '' });

  session.once('remoteSettings', () => {
    assert.ok(Array.isArray(session.originSet));
    assert.ok(session.originSet.length > 0);

    session.close();
    done();
  });

  session.on('error', done);
});