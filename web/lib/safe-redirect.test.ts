import assert from "node:assert/strict";
import { test } from "node:test";

import { DEFAULT_REDIRECT, safeRedirect } from "./safe-redirect.ts";

test("allows same-origin paths under allowed prefixes", () => {
  assert.equal(safeRedirect("/app"), "/app");
  assert.equal(safeRedirect("/app/runs/123?tab=trace#span-4"), "/app/runs/123?tab=trace#span-4");
  assert.equal(safeRedirect("/onboarding"), "/onboarding");
  assert.equal(safeRedirect("%2Fapp%2Fruns"), "/app/runs");
});

test("falls back for missing or non-string values", () => {
  assert.equal(safeRedirect(undefined), DEFAULT_REDIRECT);
  assert.equal(safeRedirect(null), DEFAULT_REDIRECT);
  assert.equal(safeRedirect(""), DEFAULT_REDIRECT);
  assert.equal(safeRedirect(["/app", "/onboarding"]), DEFAULT_REDIRECT);
  assert.equal(safeRedirect("/x".repeat(300)), DEFAULT_REDIRECT);
});

test("rejects open-redirect payloads", () => {
  const payloads = [
    "https://evil.example/app",
    "//evil.example/app",
    "/\\evil.example/app",
    "\\\\evil.example",
    "%2F%2Fevil.example",
    "/%5Cevil.example",
    "javascript:alert(1)",
    "/app\u0000",
    "%E0%A4%A", // malformed encoding
  ];
  for (const payload of payloads) {
    assert.equal(safeRedirect(payload), DEFAULT_REDIRECT, payload);
  }
});

test("rejects paths outside the allow-list, including traversal", () => {
  assert.equal(safeRedirect("/"), DEFAULT_REDIRECT);
  assert.equal(safeRedirect("/login"), DEFAULT_REDIRECT);
  assert.equal(safeRedirect("/apple"), DEFAULT_REDIRECT);
  assert.equal(safeRedirect("/app/../api/auth/sign-out"), DEFAULT_REDIRECT);
});

test("uses the provided fallback", () => {
  assert.equal(safeRedirect("//evil.example", "/onboarding"), "/onboarding");
});
