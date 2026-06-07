// https://github.com/oven-sh/bun/issues/28647

const assert = require('assert');
const test = require('node:test');

test("test should pass", () => {
    assert.deepStrictEqual(new Proxy(['foo'], {}), ['foo']);
})