// https://github.com/oven-sh/bun/issues/28760

const test = require('node:test');
const assert = require('node:assert');

test('assert.deepEqual and deepStrictEqual should throw on unequal Sets', () => {
  const actual1 = new Set([{ a: 1 }, { a: 1 }]);
  const expected1 = new Set([{ a: 1 }, { a: 2 }]);

  assert.throws(() => {
    assert.deepEqual(actual1, expected1);
  }, /Expected values to be loosely deep-equal/);

  const actual2 = new Set([{ a: 1 }, { a: 1 }]);
  const expected2 = new Set([{ a: 1 }, { a: 2 }]);

  assert.throws(() => {
    assert.deepStrictEqual(actual2, expected2);
  }, /Expected values to be strictly deep-equal/);
});