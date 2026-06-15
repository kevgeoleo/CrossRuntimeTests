// https://github.com/oven-sh/bun/issues/29077?reload=1

import test from "node:test";
import assert from "node:assert/strict";
import { Worker } from "node:worker_threads";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test("Worker.terminate() resolves its promise", async () => {
  const worker = new Worker(path.join(__dirname, "worker.mjs"));

  const result = await worker.terminate();

  // Node currently resolves with the worker's exit code (typically 0)
  assert.equal(typeof result, "number");
});