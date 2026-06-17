// https://github.com/denoland/deno/issues/33257
// fixed in linux for deno but not in windows wsl

import test from "node:test";
import assert from "node:assert/strict";

test("mongodb-memory-server exports MongoMemoryServer", async () => {
  const mod = await import("mongodb-memory-server");

  assert.ok(
    "MongoMemoryServer" in mod,
    "MongoMemoryServer export is missing",
  );

  assert.equal(typeof mod.MongoMemoryServer, "function");
});