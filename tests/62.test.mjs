// https://github.com/oven-sh/bun/issues/29225

import test from "node:test";
import assert from "node:assert/strict";
import { ReadableStreamBYOBReader } from "node:stream/web";

test("ReadableStreamBYOBReader is exposed as a class", () => {
  assert.equal(typeof ReadableStreamBYOBReader, "function");

  // Native classes stringify as "class ..."
  assert.match(
    Function.prototype.toString.call(ReadableStreamBYOBReader),
    /^class\b/,
  );
});

test("ReadableStreamBYOBReader.prototype.constructor points to itself", () => {
  assert.equal(
    ReadableStreamBYOBReader.prototype.constructor,
    ReadableStreamBYOBReader,
  );
});

test("ReadableStreamBYOBReader can be used in instanceof checks", () => {
  const stream = new ReadableStream({
    type: "bytes",
    pull(controller) {
      controller.close();
    },
  });

  const reader = stream.getReader({ mode: "byob" });

  assert.ok(reader instanceof ReadableStreamBYOBReader);

  reader.releaseLock();
});