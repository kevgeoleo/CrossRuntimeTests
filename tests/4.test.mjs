// https://github.com/denoland/deno/issues/32326
import test from 'node:test';
import assert from 'node:assert';

await test('a test', () => {
  assert.strictEqual(1 + 1, 2);
});