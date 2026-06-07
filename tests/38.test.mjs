//https://github.com/oven-sh/bun/issues/28745

import test from 'node:test';
import assert from 'node:assert';

test('module URL encoding resolution', async () => {
  try {
    await import('./foo%2cbar.mjs');
    assert.ok(true, 'Module should load if resolver decodes %2c');
  } catch (e) {
    assert.fail('Module resolution failed: ' + e.message);
  }
});