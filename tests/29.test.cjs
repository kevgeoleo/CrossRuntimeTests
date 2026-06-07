// https://github.com/oven-sh/bun/issues/28664

const test = require('node:test');
const assert = require('node:assert');

test('domain should catch fatal exceptions via process._fatalException', () => {
  const domain = require('node:domain');

  let sawError = false;

  domain
    .create()
    .on('error', (e) => {
      sawError = true;
      assert.strictEqual(e.message, 'CRASH!!!');
      assert.ok(e.domainThrown === true);
    })
    .run(() => {
      setImmediate(() => {
        process._fatalException(new Error('CRASH!!!'));
      });
    });

  // allow event loop to process
  return new Promise((resolve) => {
    setTimeout(() => {
      assert.ok(sawError, 'Expected domain error handler to be called');
      resolve();
    }, 50);
  });
});

