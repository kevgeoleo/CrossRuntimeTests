// https://github.com/oven-sh/bun/issues/29019

import test from 'node:test';
import assert from 'node:assert';

test('stdout color capability is available', () => {
  assert.strictEqual(typeof process.stdout.hasColors, 'function');

  const result = process.stdout.hasColors();
  assert.strictEqual(typeof result, 'boolean');
});