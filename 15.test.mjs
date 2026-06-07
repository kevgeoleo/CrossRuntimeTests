//https://github.com/denoland/deno/issues/32895

import test from 'node:test';
import assert from 'node:assert/strict';

test('Buffer.concat must preserve very large buffers (>4GB boundary)', () => {
  const largeBuffer = Buffer.alloc(2 ** 32 + 5);
  largeBuffer.fill(111);

  const result = Buffer.concat([largeBuffer]);

  // Sanity check source
  assert.strictEqual(largeBuffer.length, 2 ** 32 + 5);

  // concat must NOT truncate at 4GB boundary
  assert.strictEqual(
    result.length,
    largeBuffer.length,
    `BUG: Buffer.concat truncated data. Expected ${largeBuffer.length}, got ${result.length}`
  );

  // Content integrity check (first bytes)
  const srcSlice = Array.from(largeBuffer.subarray(0, 20));
  const resSlice = Array.from(result.subarray(0, 20));

  assert.deepStrictEqual(
    resSlice,
    srcSlice,
    'BUG: Buffer.concat content mismatch'
  );
});