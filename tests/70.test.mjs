// https://github.com/denoland/deno/issues/33343

import test from 'node:test';
import assert from 'node:assert/strict';
import { connect } from 'nats';

test('connects to demo.nats.io', async () => {
  const nc = await connect({
    servers: 'demo.nats.io:4222',
    timeout: 5000,
  });

  assert.ok(nc);

  await nc.close();
  await nc.closed();
});