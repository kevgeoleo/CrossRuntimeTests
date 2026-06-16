// https://github.com/oven-sh/bun/issues/29195

import test from "node:test";
import assert from "node:assert/strict";

const url = "https://example.com/";

const invalidInitValues = [
  0,
  0n,
  "",
  false,
  Symbol("test"),
];

async function runFetch(v) {
  try {
    await fetch(url, v);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e };
  }
}

for (const v of invalidInitValues) {
  test(`fetch(url, ${String(v)}) should throw TypeError`, async () => {
    const res = await runFetch(v);

    // Node expects rejection
    assert.equal(
      res.ok,
      false,
      "fetch should reject invalid RequestInit values"
    );

    assert.ok(
      res.error instanceof TypeError,
      `Expected TypeError, got ${res.error?.name}`
    );
  });
}