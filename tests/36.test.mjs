// https://github.com/denoland/deno/issues/33102

import test from "node:test";
import assert from "node:assert";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

test("fs.watch should emit rename on file creation", (t, done) => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "watch-test-"));
  const file = path.join(dir, "a.txt");

  const watcher = fs.watch(dir, { recursive: true }, (event, filename) => {
    try {
      assert.strictEqual(event, "rename");
      assert.strictEqual(filename, "a.txt");

      watcher.close();
      done();
    } catch (err) {
      done(err);
    }
  });

  fs.writeFileSync(file, "hello");
});
