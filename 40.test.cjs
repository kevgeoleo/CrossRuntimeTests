// https://github.com/oven-sh/bun/issues/28751

const test = require('node:test');
const assert = require('node:assert');
const url = require('node:url');

test('url.parse + url.format preserves legacy auth decoding behavior', () => {
  const user = encodeURIComponent('us:er');
  const password = encodeURIComponent('pass:word');

  const uri = 'http://' + user + ':' + password + '@localhost/';

  const parsed = url.parse(uri);

  // Node legacy behavior: auth is fully decoded
  assert.strictEqual(parsed.auth, 'us:er:pass:word');

  const formatted = url.format(parsed);

  // Critical Node expectation: NO re-encoding of ':' in auth
  assert.strictEqual(
    formatted,
    'http://us:er:pass:word@localhost/',
  );
});