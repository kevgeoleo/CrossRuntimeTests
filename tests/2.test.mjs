// https://github.com/oven-sh/bun/issues/27422
import { it } from 'node:test';

const sleep = (durationMSec) => new Promise((resolve) => setTimeout(resolve, durationMSec));

it('bla1', async () => {
  await sleep(7000);
});

it('bla2', async () => {
  await sleep(7000);
});