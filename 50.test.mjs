import test from 'node:test';
import assert from 'node:assert';

test('Response should serialize array body with commas', async () => {
  const result = await new Response([1, 2, 3]).text();

  assert.strictEqual(result, '1,2,3');
});