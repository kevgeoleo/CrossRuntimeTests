// https://github.com/oven-sh/bun/issues/29174

import test from "node:test";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

test("fileURLToPath throws on malformed percent-encoding", () => {
  const __dirname = dirname(fileURLToPath(import.meta.url));

  const filePath = join(__dirname, "% users.txt");
  const fileUrl = new URL(
    `file://${process.platform === "win32" ? "/" : ""}${filePath.replace(/\\/g, "/")}`,
  );

  assert.throws(
    () => fileURLToPath(fileUrl),
    URIError,
  );
});