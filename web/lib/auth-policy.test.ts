import assert from "node:assert/strict";
import { test } from "node:test";

import { signInMethodsLine } from "./auth-policy.ts";

test("names only the configured providers", () => {
  assert.equal(signInMethodsLine([]), "Use your email and password.");
  assert.equal(signInMethodsLine(["google"]), "Use Google or your email and password.");
  assert.equal(signInMethodsLine(["google", "github"]), "Use Google, GitHub or your email and password.");
});
