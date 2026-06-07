// https://github.com/oven-sh/bun/issues/27287
// https://github.com/denoland/deno/issues/32279

const test = require('node:test');
const assert = require('node:assert/strict')

globalThis.err = new Error();

test('ESM/CJS bad module throws and rejects correctly', async () => {
  // require() should throw
  assert.throws(() => require('./bad-esm.mjs'), globalThis.err);

  // dynamic import should reject
  await assert.rejects(
    import('./bad-esm.mjs'),
    globalThis.err
  );
});

/*'use strict';
const assert = require('node:assert');
globalThis.err = new Error;
assert.throws(() => require('./bad-esm.mjs'), globalThis.err);
assert.rejects(import('./bad-esm.mjs').then(console.log), globalThis.err);*/
