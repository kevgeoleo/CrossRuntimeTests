// https://github.com/denoland/deno/issues/33103

import test from "node:test";
import assert from "node:assert";
import fs from "node:fs";

test("fs.watch should throw synchronously for invalid path", () => {
  assert.throws(() => {
    fs.watch("does-not-exist");
  }, /ENOENT|not exist|invalid/i);
});