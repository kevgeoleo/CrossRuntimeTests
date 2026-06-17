// fixtures/temp2.mjs
globalThis.__events.push(1);

await new Promise((r) => setTimeout(r, 200));

globalThis.__events.push(2);