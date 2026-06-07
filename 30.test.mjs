// https://github.com/oven-sh/bun/issues/28666

import { test } from 'node:test';
import assert from 'node:assert';
import { Script } from 'node:vm';

test('vm.Script constructor should throw SyntaxError and preserve filename context (Runtime Parity)', () => {
  const invalidCode = 'Math.max(a, b';
  const filename = 'main_test_context';

  let thrownError = null;

  try {
    new Script(invalidCode, { filename });
  } catch (error) {
    thrownError = error;
  }

  // 1. Core behavior check: Did it throw?
  assert.ok(thrownError !== null, 'Constructor completed successfully instead of failing synchronously.');
  assert.strictEqual(thrownError.name, 'SyntaxError', 'Thrown exception should be a SyntaxError');

  // 2. Strict Node Parity check: Is the custom filename bound to the stack trace?
  try {
    assert.match(
      thrownError.stack,
      new RegExp(filename),
      `The stack trace must frame the error using the custom filename context "${filename}".`
    );
  } catch (err) {
    // If the error is thrown but the stack format is broken (like on Deno), catch it cleanly
    throw new assert.AssertionError({
      message: `BUG detected: Runtime throws the error but ignores the 'filename' option in the stack trace layout.`,
      expected: `Stack trace containing "${filename}"`,
      actual: thrownError.stack
    });
  }
});