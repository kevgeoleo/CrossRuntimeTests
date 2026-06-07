//https://github.com/oven-sh/bun/issues/28434

import test from 'node:test';
import assert from 'node:assert';

test('structuredClone with transfer of ReadableStream', () => {
  const original = new ReadableStream();

  let threw = false;
  let error;

  try {
    const transfer = structuredClone(original, {
      transfer: [original],
    });

    // If it succeeds, verify prototype as in your repro
    const sameProto =
      Object.getPrototypeOf(transfer) === ReadableStream.prototype;

    assert.ok(
      sameProto,
      'Transferred object should still be a ReadableStream'
    );
  } catch (err) {
    threw = true;
    error = err;
  }

  assert.equal(
    threw,
    false,
    `structuredClone should not throw. Got: ${error?.name}: ${error?.message}`
  );
});