// https://github.com/denoland/deno/issues/31102

import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';

test('AES-128-GCM should produce 12-byte auth tag', () => {
  const serverKeyArr = crypto.randomBytes(16);
  const iv = crypto.randomBytes(12);

  const cipher = crypto.createCipheriv(
    'aes-128-gcm',
    serverKeyArr,
    iv,
    { authTagLength: 12 }
  );

  cipher.update('foo');
  cipher.final();

  const authTag = cipher.getAuthTag();

  assert.strictEqual(
    authTag.length,
    12,
    `BUG: Expected authTag length 12 but got ${authTag.length}`
  );
});

/*import crypto from "node:crypto";
import assert from "node:assert/strict";

const serverKeyArr = crypto.randomBytes(16);
const iv = crypto.randomBytes(12);

const cipher = crypto.createCipheriv(
  "aes-128-gcm",
  serverKeyArr,
  iv,
  { authTagLength: 12 }
);

cipher.update("foo");
cipher.final();

const authTag = cipher.getAuthTag();

// ✅ Assertion
assert.strictEqual(
  authTag.length,
  12,
  `BUG: Expected authTag length 12 but got ${authTag.length}`
);*/
