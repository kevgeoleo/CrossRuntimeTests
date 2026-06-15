// https://github.com/oven-sh/bun/issues/29175

import { test } from 'node:test';
import assert from 'node:assert';
import { spawnSync } from 'node:child_process';
import { writeFileSync, unlinkSync } from 'node:fs';
import { join } from 'path';

test('signal-exit onExit handler should execute on process termination', () => {
  const fixturePath = join(process.cwd(), 'temp-fixture.mjs');
  
  // 1. Create a temporary script that uses signal-exit
  const fixtureCode = `
    import { onExit } from 'signal-exit';
    
    onExit((code, signal) => {
      process.stdout.write('process exited!\\n');
    }, { alwaysLast: true });
  `;
  
  writeFileSync(fixturePath, fixtureCode, 'utf8');

  try {
    // 2. Spawn the script using the current runtime executable (Node or Bun)
    const result = spawnSync(process.execPath, [fixturePath], { encoding: 'utf8' });

    // 3. Assert that the stdout contains the expected exit message
    assert.match(
      result.stdout, 
      /process exited!/, 
      `Expected runtime (${process.execPath}) to execute the onExit handler.`
    );
  } finally {
    // 4. Clean up the fixture file regardless of test success/failure
    try {
      unlinkSync(fixturePath);
    } catch {}
  }
});