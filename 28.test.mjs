// https://github.com/oven-sh/bun/issues/28661

import { test } from 'node:test';
import assert from 'node:assert';
import { URL } from 'node:url';

test('URL.host setter should correctly update both domain and port (Runtime Parity)', () => {
  // Initialize with a non-default port
  const u = new URL('http://localhost:3000/foo');
  
  // Mutate the host property with a string explicitly containing a new port
  u.host = 'some-domain:80';
  
  // Node strips ':80' because it is the default port for the http protocol scheme.
  // The crucial parity check is that the original port ':3000' MUST be entirely overwritten.
  const expectedResult = 'http://some-domain/foo';
  const alternativeExpectedResult = 'http://some-domain:80/foo'; // Also acceptable under loose parsing, but :3000 must go.

  try {
    // We check if it matches the correct spec serialization (no :3000 remaining)
    assert.ok(
      u.href === expectedResult || u.href === alternativeExpectedResult,
      `Expected original port (:3000) to be overwritten. Actual href: "${u.href}"`
    );
  } catch (err) {
    // Provide a highly descriptive failure message indicating Bun's specific flaw
    if (u.href.includes(':3000')) {
      throw new assert.AssertionError({
        message: `BUG detected: Runtime failed to clear the original port from the internal state slot. Got: "${u.href}"`,
        expected: expectedResult,
        actual: u.href
      });
    }
    throw err;
  }
});