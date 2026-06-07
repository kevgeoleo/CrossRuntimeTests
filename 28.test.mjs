// https://github.com/oven-sh/bun/issues/28661

import test from 'node:test';
import assert from 'node:assert';
import { URL } from 'node:url';

test('URL.host must override previous port', () => {
  const u = new URL('http://localhost:3000/foo');

  u.host = 'some-domain:80';

  assert.strictEqual(u.hostname, 'some-domain');
  assert.notStrictEqual(u.port, '3000');

  // Node normalization typically drops default http port
  assert.ok(
    u.href === 'http://some-domain/foo' ||
    u.href === 'http://some-domain:80/foo'
  );
});

