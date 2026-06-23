// https://github.com/denoland/deno/issues/33340
// works in linux not windows

import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';

test('spawnSync supports sparse stdio arrays with inherited file descriptors', () => {
  const fdA = fs.openSync('/dev/null', 'r');
  const fdB = fs.openSync('/dev/null', 'r');
  const fdC = fs.openSync('/dev/null', 'r');
  const fdD = fs.openSync('/dev/null', 'r');

  try {
    const inheritedFds = [fdA, fdB, fdC, fdD];

    const maxFd = Math.max(...inheritedFds);
    const stdio = new Array(maxFd + 1).fill(null);

    // Capture stdout from the child.
    stdio[1] = 'pipe';

    // Inherit the opened descriptors at their actual fd numbers.
    for (const fd of inheritedFds) {
      stdio[fd] = 'inherit';
    }

    const result = spawnSync('ls', ['/dev/fd'], {
      stdio,
      encoding: 'utf8',
    });

    assert.equal(result.status, 0);

    const output = result.stdout.trim().split(/\s+/);

    for (const fd of inheritedFds) {
      assert.ok(
        output.includes(String(fd)),
        `expected inherited fd ${fd} to be visible in child process`
      );
    }
  } finally {
    fs.closeSync(fdA);
    fs.closeSync(fdB);
    fs.closeSync(fdC);
    fs.closeSync(fdD);
  }
});