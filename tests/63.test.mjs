// https://github.com/oven-sh/bun/issues/29227

import test from "node:test";
import assert from "node:assert/strict";
import dns from "node:dns";

test("dns.lookup('mongo-1') prefers IPv4 when hostname resolves", async (t) => {
  const result = await new Promise((resolve) => {
    dns.lookup("mongo-1", (err, address, family) => {
      resolve(err ? null : { address, family });
    });
  });

  if (result === null) {
    t.skip("mongo-1 does not resolve in this environment");
    return;
  }

  assert.equal(result.address, "127.0.0.1");
  assert.equal(result.family, 4);
});