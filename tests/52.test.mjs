// https://github.com/oven-sh/bun/issues/29157

import test from "node:test";
import assert from "node:assert/strict";

test("Promise.any rejects with AggregateError when all promises reject", async () => {
  const error = await Promise.any([
    Promise.reject(new Error("")),
  ]).catch(err => err);

  assert.ok(error instanceof AggregateError);
  assert.equal(error.errors.length, 1);
  assert.ok(error.errors[0] instanceof Error);
});