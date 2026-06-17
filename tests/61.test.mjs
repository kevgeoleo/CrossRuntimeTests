//https://github.com/oven-sh/bun/issues/29221

import test from "node:test";
import assert from "node:assert/strict";

test("multiple dynamic imports share the same evaluation promise", async () => {
  const events = [];

  globalThis.__events = events;

  await Promise.all([
    import("./temp2.mjs").then(() => events.push(3)),
    import("./temp2.mjs").then(() => events.push(4)),
  ]);

  assert.deepEqual(events, [1, 2, 3, 4]);
});