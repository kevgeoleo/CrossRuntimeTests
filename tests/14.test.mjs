//https://github.com/denoland/deno/issues/32894

import test from 'node:test';
import assert from 'node:assert/strict';
import QuickLRU from 'quick-lru';

class BotChatEmitter {}

class Bot {
  constructor() {
    this.chatEventEmitter = new BotChatEmitter();
    this.cache = new QuickLRU({ maxSize: 10 });

    this.cache.set('bot', this);
    this.chatEventEmitter.bot = this;
  }
}

test('console.log should not crash on circular structures (Deno vs Node parity)', () => {
  const bot = new Bot();

  let threw = false;
  let err;

  try {
    console.log(bot);
  } catch (e) {
    threw = true;
    err = e;
  }

  // Node expectation: no crash
  assert.strictEqual(
    threw,
    false,
    `BUG: console.log threw an error: ${err?.message}`
  );
});