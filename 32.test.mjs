// https://github.com/denoland/deno/issues/33086

import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

test('fs.readFileSync(fd) should read from the beginning of a sparse file regardless of cursor (Runtime Parity)', () => {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const targetPath = path.join(__dirname, 'test-sparse-read-file.tmp');
  const totalSize = 8192;

  // Ensure clean setup
  if (fs.existsSync(targetPath)) fs.unlinkSync(targetPath);

  // 1. Open file with read/write access
  const fd = fs.openSync(targetPath, 'w+');

  try {
    // 2. Form a sparse file by writing a single byte at the very end
    const singleByte = Buffer.alloc(1, 1);
    fs.writeSync(fd, singleByte, 0, 1, totalSize - 1);

    // Verify the OS reports the correct structural size
    const stats = fs.fstatSync(fd);
    assert.strictEqual(stats.size, totalSize, 'The OS file system should report a size of 8192 bytes.');

    // 3. Attempt to read the entire file using the active File Descriptor
    const result = fs.readFileSync(fd);

    // Deno fails here by returning a length of 0 due to an advanced stream cursor pointer
    assert.strictEqual(
      result.length,
      totalSize,
      `BUG detected: readFileSync returned a buffer of length ${result.length} instead of ${totalSize}.`
    );

    // 4. Validate payload contents to ensure data wasn't corrupted or shifted
    assert.strictEqual(result[totalSize - 1], 1, 'The byte at the final position should be 1.');
    assert.strictEqual(result[0], 0, 'The unallocated sparse prefix byte should be 0.');

  } finally {
    // Structural cleanup guarantees stability across iterative suite runs
    fs.closeSync(fd);
    if (fs.existsSync(targetPath)) {
      fs.unlinkSync(targetPath);
    }
  }
});