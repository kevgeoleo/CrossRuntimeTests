// https://github.com/denoland/deno/issues/24324

import test from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import net from "node:net";

test("ServerResponse emits 'close' when client disconnects mid-response", async () => {
  const server = http.createServer((req, res) => {
    let closed = false;

    res.on("close", () => {
      closed = true;
    });

    res.write("hello\n");

    req.on("error", () => {
      server.close();
    });

    // expose state for assertion after teardown
    server._closedFlag = () => closed;
  });

  await new Promise((resolve) => {
    server.listen(0, resolve);
  });

  const port = server.address().port;

  await new Promise((resolve) => {
    const client = net.createConnection({ port }, () => {
      client.write(
        "GET / HTTP/1.1\r\nHost: localhost\r\nConnection: close\r\n\r\n"
      );

      client.on("data", () => {
        // force disconnect mid-response
        client.end();
      });
    });

    client.on("close", () => {
      // allow server-side cleanup to run
      setTimeout(() => {
        server.close(() => {
          try {
            assert.equal(
              server._closedFlag(),
              true,
              "Expected res 'close' event to fire on client disconnect"
            );
          } finally {
            resolve();
          }
        });
      }, 50);
    });
  });
});