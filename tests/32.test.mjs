// https://github.com/denoland/deno/issues/33086

import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';

test('readFileSync(fd) must read full sparse file', () => {
  const path = 'test-sparse-file';
  const fd = fs.openSync(path, 'w+');

  try {
    fs.writeSync(fd, Buffer.from([1]), 0, 1, 8191);

    const stat = fs.fstatSync(fd);
    assert.strictEqual(stat.size, 8192);

    const buf = fs.readFileSync(fd);

    assert.strictEqual(buf.length, 8192);
    assert.strictEqual(buf[8191], 1);
  } finally {
    fs.closeSync(fd);
    fs.unlinkSync(path);
  }
});
