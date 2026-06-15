// https://github.com/oven-sh/bun/issues/29159

import test from "node:test";
import assert from "node:assert/strict";

test("importing a JavaScript data URL containing TypeScript syntax throws", async () => {
  await assert.rejects(
    import(
      "data:application/javascript;base64,ZXhwb3J0IGNvbnN0IGEgPSAiYSI7CgpleHBvcnQgZW51bSBBIHsKICBBLAogIEIsCiAgQywKfQo="
    ),
    SyntaxError,
  );
});