// https://github.com/denoland/deno/issues/33096
// integer overflow, potential vuln

import test from 'node:test';
import assert from 'node:assert';
import crypto from 'node:crypto';

test('Cipheriv.update must reject extremely large single buffer', () => {
  const cipher = crypto.createCipheriv(
    'aes-128-gcm',
    Buffer.alloc(16),
    Buffer.alloc(12)
  );

  assert.throws(() => {
    cipher.update(Buffer.allocUnsafeSlow(2 ** 31 - 1)); // ~1GB
  });
});

