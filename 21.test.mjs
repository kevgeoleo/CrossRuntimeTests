// https://github.com/oven-sh/bun/issues/28472

import test from "node:test";
import assert from "node:assert";
import { Worker, isMainThread } from "node:worker_threads";
import inspector from "node:inspector";

test("inspector profiler works across worker_threads", (t, done) => {
  const session = new inspector.Session();
  session.connect();

  session.post("Profiler.enable", () => {
    session.post("Profiler.start", () => {
      const worker = new Worker(new URL(import.meta.url), {
        type: "module",
      });

      setTimeout(() => {
        session.post("Profiler.stop", (err, res) => {
          try {
            assert.ok(res);
            assert.ok(res.profile);
          } catch (e) {
            done(e);
            return;
          }

          session.disconnect();
          worker.terminate().finally(() => done());
        });
      }, 500);
    });
  });

  // worker code path
  if (!isMainThread) {
    const session = new inspector.Session();
    session.connect();

    session.post("Profiler.enable", () => {
      session.post("Profiler.start", () => {
        for (let i = 0; i < 1e5; i++);

        session.post("Profiler.stop", (err, res) => {
          console.log("Worker profile done");
          session.disconnect();
        });
      });
    });
  }
});