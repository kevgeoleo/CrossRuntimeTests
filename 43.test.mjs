// https://github.com/oven-sh/bun/issues/28958

import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

test('fs.rmSync on directory without recursive/force should throw EISDIR', () => {
  const testDir = path.join(process.cwd(), 'deno-eisdir-test-dir');

  // ensure directory exists
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir, { recursive: true });
  }

  try {
    fs.rmSync(testDir, { recursive: false, force: false });

    assert.fail('Expected fs.rmSync to throw ERR_FS_EISDIR');
  } catch (err) {
    // Node/Deno expected semantic error
    assert.ok(err, 'Expected an error');

    assert.strictEqual(err.code, 'ERR_FS_EISDIR');

    assert.ok(
      /directory/i.test(err.message),
      'Expected directory-related error message'
    );
  } finally {
    // cleanup (best effort, recursive to avoid leftover state)
    try {
      fs.rmSync(testDir, { recursive: true, force: true });
    } catch {}
  }
});