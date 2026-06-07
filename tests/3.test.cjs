// https://github.com/oven-sh/bun/issues/27425

const assert = require('node:assert/strict');
const test = require('node:test');

test('foo.cjs throws SyntaxError on require', () => {
  assert.throws(
    () => {
      require('./foo.cjs');
    },
    SyntaxError
  );
});

/*const assert = require('node:assert/strict');

try {
  require('./foo.cjs');
} catch (err) {
  assert.ok(
    err instanceof SyntaxError,
    `Expected SyntaxError but got ${err?.constructor?.name}`
  );
}*/