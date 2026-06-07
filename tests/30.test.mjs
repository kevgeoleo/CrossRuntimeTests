// https://github.com/oven-sh/bun/issues/28666

import test from 'node:test';
import assert from 'node:assert';
import vm from 'node:vm';

test('vm.Script should throw SyntaxError on invalid JS', () => {
  assert.throws(() => {
    new vm.Script('Math.max(a, b', { filename: 'main' });
  }, SyntaxError);
});

