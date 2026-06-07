// https://github.com/oven-sh/bun/issues/28671

import test from 'node:test';
import assert from 'node:assert';
import crypto from 'node:crypto';

test('RSA key generation should support aes-128-ecb (Node compatibility)', () => {
  assert.doesNotThrow(() => {
    crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
        cipher: 'aes-128-ecb',
        passphrase: 'abcdef'
      }
    });
  });
});
