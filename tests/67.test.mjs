// https://github.com/denoland/deno/issues/33288

import test from 'node:test';
import assert from 'node:assert/strict';

import { Server as HttpServer } from 'node:http';
import { Server as NetServer } from 'node:net';

test('http.Server inherits from net.Server', () => {
  assert.equal(HttpServer.prototype instanceof NetServer, true);
});

test('net.Server does not inherit from http.Server', () => {
  assert.equal(NetServer.prototype instanceof HttpServer, false);
});