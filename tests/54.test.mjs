// https://github.com/oven-sh/bun/issues/29162

import test from "node:test";
import assert from "node:assert/strict";

test("fetch response body accepts a BYOB reader", async () => {
  const res = await fetch("http://example.com");

  assert.doesNotThrow(() => {
    const reader = res.body.getReader({ mode: "byob" });
    reader.releaseLock();
  });
});