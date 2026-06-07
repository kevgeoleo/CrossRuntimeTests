// https://github.com/denoland/deno/issues/32914

import test from 'node:test';
import assert from 'node:assert/strict';

test('structuredClone should throw on Response objects', () => {
  const res = new Response();

  assert.throws(
    () => structuredClone(res),
    {
      name: 'DataCloneError',
    },
    'BUG: structuredClone did not throw DataCloneError for Response'
  );
});