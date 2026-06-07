//https://github.com/denoland/deno/issues/32931

import test from "node:test";
import assert from "node:assert";
import util from "node:util";

test("stripVTControlCharacters removes OSC 8 hyperlinks correctly", () => {
  const input =
    "\u001b]8;;http://example.com\u001b\\This is a link\u001b]8;;\u001b\\ hello";

  const result = util.stripVTControlCharacters(input);

  assert.equal(result, "This is a link hello");
});