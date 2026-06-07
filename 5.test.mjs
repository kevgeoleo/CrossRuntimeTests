// https://github.com/oven-sh/bun/issues/27428
// https://github.com/denoland/deno/issues/32327

import test from 'node:test';
import assert from 'node:assert/strict';
import asyncHooks from 'node:async_hooks';
import http from 'node:http';
import { finished } from 'node:stream';

test('AsyncLocalStorage is preserved until response finishes', async () => {
  const asyncLocalStorage = new asyncHooks.AsyncLocalStorage();
  const store = { foo: 'bar' };

  const server = http.createServer((req, res) => {
    asyncLocalStorage.run(store, () => {
      finished(res, () => {
        const value = asyncLocalStorage.getStore()?.foo;

        assert.strictEqual(
          value,
          'bar',
          `BUG: expected "bar" but got ${value}`
        );
      });
    });

    setTimeout(() => res.end(), 0);
  });

  await new Promise((resolve) => {
    server.listen(0, () => {
      const port = server.address().port;

      http.get(`http://127.0.0.1:${port}`, (res) => {
        res.resume();
        res.on('end', () => {
          server.close(resolve);
        });
      });
    });
  });
});

/*const asyncHooks = require('async_hooks');
const http = require('http');
const finished = require('stream').finished;
const assert = require('node:assert/strict');

const asyncLocalStorage = new asyncHooks.AsyncLocalStorage();
const store = { foo: 'bar' };

const server = http.createServer(function (req, res) {
  asyncLocalStorage.run(store, function () {
    finished(res, function () {
      const value = asyncLocalStorage.getStore()?.foo;
     assert.strictEqual(
        value,
        'bar',
        `BUG: expected "bar" but got ${value}`
        );
    });
  });

  setTimeout(res.end.bind(res), 0);
}).listen(0, function () {
  const port = this.address().port;
  http.get('http://127.0.0.1:' + port, function onResponse(res) {
    res.resume();
    res.on('end', server.close.bind(server));
  });
});*/