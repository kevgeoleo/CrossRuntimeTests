// https://github.com/oven-sh/bun/issues/24001

import test from 'node:test';
import assert from 'node:assert/strict';

const TEST_URL = 'https://www.example.com';

async function testOption(optionName, value) {
  let threwSync = false;

  try {
    fetch(TEST_URL, {
      [optionName]: value,
    });
  } catch {
    threwSync = true;
  }

  assert.strictEqual(
    threwSync,
    false,
    `BUG: fetch threw synchronously when using unknown option "${optionName}"`
  );
}

test('fetch should not throw synchronously for unknown options', async () => {
  await testOption('proxy', 'http://something');
  await testOption('unix', 'test.sock');
});

/*import assert from "node:assert/strict";

const TEST_URL = "https://www.example.com"; 

async function testOption(optionName, value) {
  let flag1 = false;
  
  try {
    fetch(TEST_URL, {
      [optionName]: value,
    });
  } catch (err) {
    flag1 = true;
  }

  assert.strictEqual(
    flag1,
    false,
    `BUG: fetch threw synchronously when using unknown option "${optionName}"`
  );
}

await testOption("proxy", "http://something");
await testOption("unix", "test.sock");

console.log("OK");*/