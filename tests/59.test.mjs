// https://github.com/oven-sh/bun/issues/29211

import test from "node:test";
import assert from "node:assert/strict";
import { init } from "z3-solver";

test("z3-solver should solve simple constraints without pthread crash", async () => {
  const { Context } = await init();
  const { Solver, Int, And } = new Context("main");

  const x = Int.const("x");

  const solver = new Solver();
  solver.add(And(x.ge(0), x.le(9)));

  const result = await solver.check();

  // Node should return "sat"
  assert.equal(result, "sat");
});