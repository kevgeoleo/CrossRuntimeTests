// https://github.com/oven-sh/bun/issues/29257

import test from "node:test";
import assert from "node:assert/strict";

test("File.type preserves the provided MIME type without adding parameters", () => {
  const file = new File([], "empty.txt", {
    type: "text/plain",
  });

  assert.equal(file.type, "text/plain");
  assert.equal(file.type.includes(";"), false);
});