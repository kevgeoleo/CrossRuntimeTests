import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

test('fs.watch should throw synchronously if target path does not exist (Runtime Parity)', () => {
  return new Promise((resolve, reject) => {
    const missingPath = path.join(process.cwd(), 'definitely-does-not-exist-file.tmp');
    
    // Clean confirmation
    try { fs.unlinkSync(missingPath); } catch {}

    // Setup a listener for unhandled exceptions.
    // If Deno throws asynchronously on a future tick, this intercepts it and fails cleanly
    // rather than allowing the entire test suite process to hard-crash.
    const unhandledExceptionError = (err) => {
      process.removeListener('uncaughtException', unhandledExceptionError);
      reject(new assert.AssertionError({
        message: `BUG detected: Runtime threw an asynchronous unhandled exception instead of a synchronous error catch.\nDetails: ${err.message}`,
        expected: 'Synchronous validation error',
        actual: 'Asynchronous event loop crash'
      }));
    };
    
    process.on('uncaughtException', unhandledExceptionError);

    let caughtSynchronously = false;

    try {
      fs.watch(missingPath);
    } catch (err) {
      // Node and Bun reference trajectory: Intercepted instantly
      caughtSynchronously = true;
      process.removeListener('uncaughtException', unhandledExceptionError);
      
      try {
        assert.ok(err instanceof Error, 'Caught element must be an instance of Error constructor.');
        assert.match(
          err.code || err.message,
          /ENOENT|NotFound/i,
          `Expected a file-not-found error signature, got: "${err.message}"`
        );
        resolve(); // Success!
      } catch (assertErr) {
        reject(assertErr);
      }
    }

    // If execution passes the block without throwing (Deno's buggy trajectory),
    // give it 150ms to see if Deno's macro-task timer fires its uncaught crash.
    if (!caughtSynchronously) {
      setTimeout(() => {
        process.removeListener('uncaughtException', unhandledExceptionError);
        reject(new assert.AssertionError({
          message: 'BUG detected: fs.watch completed successfully without throwing any immediate errors for a missing path.',
          expected: 'Synchronous ENOENT Exception thrown',
          actual: 'No exception encountered'
        }));
      }, 150);
    }
  });
});