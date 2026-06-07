// https://github.com/oven-sh/bun/issues/29030

import test from "node:test";
import assert from "node:assert";

test("Object prototype must be preserved in deepStrictEqual", () => {
  const a = {};
  const b = Object.create(null);

  assert.throws(() => {
    assert.deepStrictEqual(a, b);
  });
});