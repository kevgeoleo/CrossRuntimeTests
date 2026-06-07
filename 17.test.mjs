//https://github.com/denoland/deno/issues/32915

import test from 'node:test';
import assert from 'node:assert/strict';
import process from 'node:process';

test('process.setUncaughtExceptionCaptureCallback should exist and be callable', () => {
  // In Node, this must exist
  assert.strictEqual(
    typeof process.setUncaughtExceptionCaptureCallback,
    'function',
    'BUG: process.setUncaughtExceptionCaptureCallback is missing or not a function'
  );

  // Should not throw when called
  assert.doesNotThrow(() => {
    process.setUncaughtExceptionCaptureCallback((err) => {
      console.log('caught error:', err);
    });
  });
});