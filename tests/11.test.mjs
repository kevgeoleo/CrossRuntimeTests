// https://github.com/denoland/deno/issues/31099

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const FILE = 'data.txt';

test('readFileSync with flag w+ should not throw and should create file', () => {
  // Ensure clean state
  try {
    fs.unlinkSync(FILE);
  } catch {}

  let threw = false;

  try {
    fs.readFileSync(FILE, { encoding: 'utf8', flag: 'w+' });
  } catch {
    threw = true;
  }

  // Must NOT throw (Node behavior)
  assert.strictEqual(
    threw,
    false,
    "BUG: readFileSync with flag 'w+' should not throw"
  );

  // File must now exist
  assert.strictEqual(
    fs.existsSync(FILE),
    true,
    "BUG: File was not created with 'w+' flag"
  );

  // Cleanup
  fs.unlinkSync(FILE);
});

/*import fs from "node:fs";
import assert from "node:assert/strict";

const FILE = "data.txt";

// Ensure clean state
try {
  fs.unlinkSync(FILE);
} catch {}

// --- TEST ---
let threw = false;

try {
  fs.readFileSync(FILE, { encoding: "utf8", flag: "w+" });
} catch (err) {
  threw = true;
}

// Must NOT throw (Node behavior)
assert.strictEqual(
  threw,
  false,
  "BUG: readFileSync with flag 'w+' should create file instead of throwing"
);

// File must now exist
assert.strictEqual(
  fs.existsSync(FILE),
  true,
  "BUG: File was not created with 'w+' flag"
);

// Cleanup
fs.unlinkSync(FILE);

console.log("OK");*/