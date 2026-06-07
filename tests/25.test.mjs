// https://github.com/oven-sh/bun/issues/28622
// works in Linux for Node but fails in Windows

import test from 'node:test';
import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';

test('UNC extended path is preserved in structure', () => {
  const input = '\\\\?\\UNC\\server\\share\\folder\\file.txt';

  const url = pathToFileURL(input);

  const href = url.href;

  // must still be file URL
  assert.ok(href.startsWith('file:///'));

  // must preserve UNC host
  assert.ok(href.includes('server'));

  // must preserve extended prefix encoding
  assert.ok(href.includes('%3F') || href.includes('%5C%5C%3F'));

  // must NOT collapse into query string
  assert.ok(!href.includes('?UNC'));

  // must NOT lose file extension
  assert.ok(href.endsWith('file.txt'));
});