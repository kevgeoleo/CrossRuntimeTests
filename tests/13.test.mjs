// https://github.com/oven-sh/bun/issues/27369

import test from 'node:test';
import assert from 'node:assert/strict';
import module from 'node:module';

test('module.registerHooks should be defined (Node vs Bun compatibility)', () => {
  const value = module.registerHooks;

  // Node expects this to exist as a function
  assert.ok(
    typeof value === 'function',
    `BUG: expected module.registerHooks to be a function, got ${typeof value}`
  );
});