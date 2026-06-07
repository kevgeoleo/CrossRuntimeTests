// https://github.com/oven-sh/bun/issues/28483

import test from "node:test";
import assert from "node:assert";

test("data: import nested execution ordering", async () => {
  const logs = [];

  const originalLog = console.log;
  console.log = (...args) => logs.push(args.join(" "));

  try {
    await import(
      `data:text/javascript,
        await import("data:text/javascript,console.log('before')");
      `
    );
  } catch {}

  console.log = originalLog;

  // give microtask queue time to flush nested import
  await new Promise((r) => setImmediate(r));

  assert.ok(logs.includes("before"));
});