// https://github.com/oven-sh/bun/issues/29022?reload=1

import test from 'node:test';
import assert from 'node:assert';
import { MessageChannel } from 'node:worker_threads';

test('MessagePort should expose EventEmitter removeListener API', () => {
  const { port1 } = new MessageChannel();

  assert.ok('removeListener' in port1)
});