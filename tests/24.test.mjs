// https://github.com/oven-sh/bun/issues/28510?reload=1

import test from 'node:test';
import assert from 'node:assert/strict';

test('invalid import attributes should throw ERR_IMPORT_ATTRIBUTE_UNSUPPORTED', async () => {
  await assert.rejects(
    import('./modules-skip-1.json', {
      with: {
        type: 'json',
        notARealAssertion: 'value'
      }
    }),
    (err) => {
      assert.strictEqual(err.code, 'ERR_IMPORT_ATTRIBUTE_UNSUPPORTED');
      return true;
    }
  );
});