# Cross Runtime Tests

This repository contains a curated collection of reproducible test cases that expose behavioral differences across JavaScript runtimes such as:

- Node.js
- Bun
- Deno

The goal is to document and validate discovered cross runtime inconsistencies, especially edge cases that often surface in real-world applications but are inconsistently implemented across runtimes.

---

## Purpose

Modern JavaScript runtimes often diverge in subtle but important ways:

- Error timing (sync vs async)
- Node API compatibility gaps
- File system semantics
- Networking edge cases
- Crypto and encoding behavior
- Stream and buffer handling

This repository captures those differences, that were reported as actual issues to runtime maintainers.

---

## Structure

Each test file:

- Is self-contained
- Demonstrates a single behavioral difference
- Includes expected vs actual output
- Can be executed independently across runtimes
- Contains a link to actual reported issue

---

### Working

1. Navigate to tests/
2. Install relevant packages using `npm install` command
3. You are good to go. Run all tests using:

```
node --test
deno test -A
bun test
```

OR

Run individual tests using:

```
node --test <filename>
deno test -A <filename>
bun test <filename>
```
