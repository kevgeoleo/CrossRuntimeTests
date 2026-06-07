// https://github.com/oven-sh/bun/issues/29043
// wont work in Node because - TypeError: globalThis.addEventListener is not a function

import test from 'node:test';
import assert from 'node:assert';
import { Worker } from 'node:worker_threads';

test('worker should allow error suppression via error handler', async () => {
  const workerCode = `
    globalThis.addEventListener('error', (e) => {
      e.preventDefault?.();
    });

    queueMicrotask(() => {
      throw new Error('hmm');
    });
  `;

  const worker = new Worker(workerCode, { eval: true });

  const exitCode = await new Promise((resolve) => {
    worker.on('exit', resolve);
  });

  // Node/Deno expectation: error suppressed → clean exit
  assert.strictEqual(exitCode, 0);
});