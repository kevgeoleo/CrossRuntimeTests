//https://github.com/denoland/deno/issues/32935

import test from "node:test";
import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";

test("fs.watch should detect immediate file changes", (t, done) => {
  const filePath = path.join(process.cwd(), "test.json");

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "{}");
  }

  let finished = false;

  const watcher = fs.watch(filePath, (eventType, filename) => {
    if (finished) return;
    finished = true;

    try {
      assert.equal(eventType, "change");
      assert.equal(filename, "test.json");
      watcher.close();
      done();
    } catch (err) {
      watcher.close();
      done(err);
    }
  });

  fs.writeFileSync(filePath, '{ "test": "test", "test2": "test2" }');

  // timeout safety: must NOT call done twice
  setTimeout(() => {
    if (finished) return;

    finished = true;
    watcher.close();
    done(new Error("fs.watch did not emit change event in time"));
  }, 2000);
});