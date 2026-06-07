// https://github.com/denoland/deno/issues/33096
// integer overflow, potential vuln

import { test } from 'node:test';
import assert from 'node:assert';
import crypto from 'node:crypto';

test('crypto.Cipheriv.update should guard against buffers at signed 32-bit int max boundary (Runtime Parity)', () => {
  const targetLength = 2 ** 31 - 1; // 2,147,483,647 bytes

  let cipher;
  try {
    cipher = crypto.createCipheriv('aes-128-gcm', Buffer.alloc(16), Buffer.alloc(12));
  } catch (initErr) {
    // Fail gracefully if the runtime lacks AES-GCM support natively
    throw new Error(`Failed to initialize cipher suite: ${initErr.message}`);
  }

  let thrownError = null;

  try {
    // Allocate the large buffer chunk
    // Note: Use allocUnsafeSlow to avoid wiping 2GB of system RAM sequentially
    const massiveBuffer = Buffer.allocUnsafeSlow(targetLength);
    
    cipher.update(massiveBuffer);
  } catch (err) {
    thrownError = err;
  }

  // Node reference behavior checks: It must intercept this with an explicit error object
  if (!thrownError) {
    throw new assert.AssertionError({
      message: 'BUG detected: Runtime successfully processed a buffer at INT_MAX width without enforcing Node\'s maximum size boundary restrictions.',
      expected: 'An unsupported state validation Error thrown synchronously',
      actual: 'Completed execution cleanly'
    });
  }

  // Validate the error footprint properties match Node's error profile
  assert.ok(
    thrownError instanceof Error,
    `Expected validation exception to be an Error constructor instance. Got: ${typeof thrownError}`
  );
  
  assert.match(
    thrownError.message,
    /unsupported state|invalid/i,
    `Error message should indicate state restrictions or buffer boundary issues. Got: "${thrownError.message}"`
  );
});