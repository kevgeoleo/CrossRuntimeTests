// https://github.com/oven-sh/bun/issues/23098

import test from 'node:test';
import assert from 'node:assert/strict';
import { inspect } from 'node:util';

test('util.inspect formats negative decimals correctly with numericSeparator option', () => {
  const values = [-0.12];
  const text = inspect(values, { numericSeparator: true });

  assert.strictEqual(
    text.replace(/\s+/g, ''),
    '[-0.12]',
    `Expected "[-0.12]" but got ${text}`
  );
});

/*import { inspect } from 'node:util';
import assert from 'node:assert/strict';

const values = [-0.12];
const text = inspect(values, { numericSeparator: true });
assert.strictEqual(
  text.replace(/\s+/g, ''),
  '[-0.12]',
  `Expected "[-0.12]" but got ${text}`
);*/