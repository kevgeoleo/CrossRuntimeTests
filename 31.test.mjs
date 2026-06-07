// https://github.com/oven-sh/bun/issues/28671

import { test } from 'node:test';
import assert from 'node:assert';
import crypto from 'node:crypto';

test('crypto.generateKeyPairSync should support aes-128-ecb wrapped private keys (Runtime Parity)', () => {
  const passphrase = 'secure_dev_pass';
  const message = 'The quick brown fox jumps over the lazy dog';
  
  let keyPair = null;
  let thrownError = null;

  try {
    keyPair = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
        cipher: 'aes-128-ecb', // The problematic configuration element
        passphrase
      }
    });
  } catch (err) {
    thrownError = err;
  }

  // If a runtime fails at generation (like Bun due to BoringSSL constraints)
  if (thrownError) {
    throw new assert.AssertionError({
      message: `BUG detected: Runtime rejected 'aes-128-ecb' key wrapping configuration structurally.\nReason: ${thrownError.message}`,
      expected: 'Successful Key Pair Object Generation',
      actual: thrownError.code || thrownError.name
    });
  }

  // Validate the produced keys can actively pass and verify asymmetrical chunks
  try {
    const encrypted = crypto.privateEncrypt(
      { key: keyPair.privateKey, passphrase },
      Buffer.from(message)
    );

    const decrypted = crypto.publicDecrypt(
      keyPair.publicKey,
      encrypted
    ).toString();

    assert.strictEqual(
      decrypted, 
      message, 
      'Decrypted message payload must match original cleartext string exactly'
    );
  } catch (executionError) {
    throw new Error(`Asymmetrical routine failed post-generation: ${executionError.message}`);
  }
});