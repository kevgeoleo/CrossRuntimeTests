// https://github.com/denoland/deno/issues/32937

import test from "node:test";
import assert from "node:assert";
import http2 from "node:http2";

test("http2 session should terminate cleanly", async () => {
  const session = http2.connect("https://plantview.i.mercedes-benz.com");

  const result = await new Promise((resolve, reject) => {
    let sawResponse = false;
    let sawEnd = false;

    session.on("error", reject);

    const req = session.request({ ":path": "/" });

    req.on("response", () => {
      sawResponse = true;
    });

    req.on("data", () => {});

    req.on("end", () => {
      sawEnd = true;

      session.close();

      // wait for actual teardown
      setTimeout(() => {
        resolve({ sawResponse, sawEnd });
      }, 200);
    });

    req.end();

    setTimeout(() => {
      reject(new Error("HTTP/2 request timeout"));
    }, 5000);
  });

  assert.ok(result.sawResponse);
  assert.ok(result.sawEnd);
});