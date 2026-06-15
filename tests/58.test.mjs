// https://github.com/oven-sh/bun/issues/29194

import test from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";

test("signal-exit onExit handler runs at process exit", async () => {
  const output = await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, ["fixture.mjs"], {
      stdio: ["ignore", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", chunk => {
      stdout += chunk;
    });

    child.stderr.on("data", chunk => {
      stderr += chunk;
    });

    child.on("error", reject);

    child.on("exit", code => {
      resolve({ code, stdout, stderr });
    });
  });

  assert.equal(output.code, 0);
  assert.match(output.stdout, /process exited!/);
});