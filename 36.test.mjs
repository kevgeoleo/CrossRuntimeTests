// https://github.com/denoland/deno/issues/33102

import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

test('fs.watch should recursively detect file creation within a folder context (Runtime Parity)', () => {
  return new Promise((resolve, reject) => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'parity-watch-test-'));
    const targetFile = path.join(tmpDir, 'test_file_target.txt');
    
    let watcher;
    
    // Set a tight 2-second timeout. 
    // Node finishes almost instantly (~20ms), Deno will hang here forever.
    const watchdogId = setTimeout(() => {
      if (watcher) watcher.close();
      try {
        fs.writeFileSync(targetFile, 'cleanup_force'); // Ensure unlinking works
        fs.unlinkSync(targetFile);
        fs.rmdirSync(tmpDir);
      } catch {}
      reject(new assert.AssertionError({
        message: 'BUG detected: File watcher failed to trigger an event following local file write mutation.',
        expected: 'Triggered watch callback with a "rename" or "change" event descriptor',
        actual: 'Test timed out while hanging indefinitely'
      }));
    }, 2000);

    try {
      // 1. Establish the recursive directory watcher
      watcher = fs.watch(tmpDir, { recursive: true }, (eventType, changedFilename) => {
        clearTimeout(watchdogId);
        watcher.close();

        try {
          // Validate event signature
          assert.ok(typeof eventType === 'string', 'Event type descriptor should be a valid string context.');
          
          // Clean up created entities before resolving
          if (fs.existsSync(targetFile)) fs.unlinkSync(targetFile);
          fs.rmdirSync(tmpDir);
          
          resolve();
        } catch (err) {
          reject(err);
        }
      });

      // 2. Introduce a minuscule delay before mutation to account for slow runtime handle registrations
      setTimeout(() => {
        fs.writeFileSync(targetFile, 'foobar_payload');
      }, 50);

    } catch (setupError) {
      clearTimeout(watchdogId);
      if (watcher) watcher.close();
      reject(setupError);
    }
  });
});