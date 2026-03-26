import test from "node:test";
import assert from "node:assert/strict";
import { uiPackageName } from "../dist/index.js";

test("ui package build exports package name constant", () => {
  assert.equal(uiPackageName, "@moment4us/ui");
});
