// https://github.com/oven-sh/bun/issues/29227
// linux specific

import test from "node:test";
import assert from "node:assert/strict";
import dns from "node:dns";

test("dns.lookup('mongo-1') prefers IPv4 when hostname resolves", async (t) => {
  const result = await new Promise((resolve) => {
    dns.lookup("mongo-1", (err, address, family) => {
      resolve(err ? null : { address, family });
    });
  });

  assert.equal(result.address, "127.0.0.1");
  assert.equal(result.family, 4);
});u