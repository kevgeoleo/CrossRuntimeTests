// https://github.com/oven-sh/bun/issues/24002

import test from 'node:test';
import assert from 'node:assert/strict';

test('Response.redirect throws TypeError on invalid URL input', () => {
  let threw = false;
  let errorType = null;

  try {
    // Invalid usage: first argument must be a URL string
    Response.redirect(420, 'blaze it');
  } catch (err) {
    threw = true;
    errorType = err instanceof TypeError;
  }

  assert.strictEqual(
    threw,
    true,
    'BUG: Response.redirect did not throw on invalid URL input'
  );

  assert.strictEqual(
    errorType,
    true,
    'BUG: Response.redirect threw wrong error type'
  );
});

/*import assert from "node:assert/strict";

let threw = false;
let errorType = null;

try {
  // Invalid usage: first argument must be a URL string
  Response.redirect(420, "blaze it");
} catch (err) {
  threw = true;
  errorType = err instanceof TypeError;
}

// Must throw
assert.strictEqual(
  threw,
  true,
  "BUG: Response.redirect did not throw on invalid URL input"
);

// Must be TypeError
assert.strictEqual(
  errorType,
  true,
  "BUG: Response.redirect threw wrong error type"
);

console.log("OK");*/