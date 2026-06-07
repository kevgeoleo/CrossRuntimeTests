// https://github.com/denoland/deno/issues/33206

import test from 'node:test';
import assert from 'node:assert';
import { spawn } from 'node:child_process';

test('kill() on exited process should indicate failure', async () => {
  const proc = spawn(process.execPath, ['-e', 'console.log("hi")'], {
    stdio: 'inherit'
  });

  await new Promise((resolve, reject) => {
    proc.on('error', reject);
    proc.on('close', resolve);
  });

  let sawFailure = false;

  try {
    const killed = proc.kill('SIGQUIT');

    if (!killed) {
      throw new Error('Failed to send SIGQUIT: process already exited');
    }

    assert.fail('Expected kill() to fail after process exit');
  } catch (err) {
    sawFailure = true;
    assert.ok(err instanceof Error);
  }

  assert.ok(sawFailure, 'Expected failure path after process exit');
});