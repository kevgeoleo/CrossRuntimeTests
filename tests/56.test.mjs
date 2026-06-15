// https://github.com/denoland/deno/issues/33236

import test from "node:test";
import assert from "node:assert/strict";
import * as pl from "nodejs-polars";

test("empty DataFrame has the expected string representation", () => {
  const df = pl.DataFrame();

  assert.equal(
    String(df),
    `shape: (0, 0)
┌┐
╞╡
└┘`,
  );
});