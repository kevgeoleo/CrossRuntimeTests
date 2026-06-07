// https://github.com/oven-sh/bun/issues/28664

import { test } from 'node:test';
import assert from 'node:assert';
import domain from 'node:domain';

test('process._fatalException should route uncaught errors to the active domain (Runtime Parity)', () => {
  return new Promise((resolve, reject) => {
    // 1. Setup a safety watchdog timeout.
    // If the runtime silently ignores the crash, this will fire and fail the test.
    const timeoutId = setTimeout(() => {
      reject(new Error('BUG detected: The exception was silently ignored and never routed to the domain handler.'));
    }, 5000);

    const d = domain.create();

    d.on('error', (err) => {
      clearTimeout(timeoutId); // Success pathway reached!
      
      try {
        assert.ok(err instanceof Error, 'Intercepted payload must be an instance of Error');
        assert.strictEqual(err.message, 'CRASH!!!', 'The intercepted error message should match exactly');
        resolve();
      } catch (assertionError) {
        reject(assertionError);
      }
    });

    d.run(() => {
      setImmediate(() => {
        // Double check if the internal API exists before attempting invocation
        if (typeof process._fatalException !== 'function') {
          clearTimeout(timeoutId);
          reject(new Error('process._fatalException is undefined in this runtime environment.'));
          return;
        }

        try {
          process._fatalException(new Error('CRASH!!!'));
        } catch (syncErr) {
          // If the runtime throws synchronously instead of routing via domain, catch it here
          clearTimeout(timeoutId);
          reject(syncErr);
        }
      });
    });
  });
});