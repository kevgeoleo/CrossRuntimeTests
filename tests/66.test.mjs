// https://github.com/denoland/deno/issues/33264

import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";

test("Hash.digest() works after hash is used as pipeline destination", async () => {
  const input = Readable.from(["hello"]);
  const hash = createHash("sha256");

  await pipeline(input, hash);

  const digest = hash.digest("hex");

  assert.equal(
    digest,
    "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824",
  );
});