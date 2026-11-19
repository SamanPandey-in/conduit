import assert from "node:assert/strict";
import { test } from "node:test";

import { actionEmail, escapeHtml, sendEmail } from "./email.ts";

const message = { to: "ada@example.test", subject: "Confirm", text: "link: https://x.test/v?t=1", html: "<p>x</p>" };

test("dev without a provider prints the message instead of sending", async (t) => {
  const logged: string[] = [];
  t.mock.method(console, "info", (line: string) => logged.push(line));
  let fetched = false;
  await sendEmail(message, { NODE_ENV: "development" }, (async () => {
    fetched = true;
    return new Response();
  }) as typeof fetch);
  assert.equal(fetched, false);
  assert.match(logged.join("\n"), /ada@example\.test/);
  assert.match(logged.join("\n"), /https:\/\/x\.test\/v\?t=1/);
});

test("production without a provider throws instead of dropping the link", async () => {
  await assert.rejects(sendEmail(message, { NODE_ENV: "production" }), /not configured/);
});

test("with a provider, posts to Resend with the key and the message", async () => {
  let request: { url: string; init: RequestInit } | undefined;
  const fakeFetch = (async (url: string, init: RequestInit) => {
    request = { url, init };
    return new Response(JSON.stringify({ id: "em_1" }), { status: 200 });
  }) as typeof fetch;

  await sendEmail(message, { RESEND_API_KEY: "re_test", EMAIL_FROM: "App <auth@example.test>" }, fakeFetch);

  assert.equal(request?.url, "https://api.resend.com/emails");
  assert.equal((request?.init.headers as Record<string, string>).Authorization, "Bearer re_test");
  const body = JSON.parse(String(request?.init.body));
  assert.deepEqual(body.to, ["ada@example.test"]);
  assert.equal(body.from, "App <auth@example.test>");
  assert.equal(body.subject, "Confirm");
});

test("a provider error surfaces as a thrown error", async () => {
  const failing = (async () => new Response("domain not verified", { status: 403 })) as typeof fetch;
  await assert.rejects(
    sendEmail(message, { RESEND_API_KEY: "re_test", EMAIL_FROM: "a@example.test" }, failing),
    /403.*domain not verified/,
  );
});

test("the template escapes everything it interpolates", () => {
  const email = actionEmail("ada@example.test", {
    appName: "App",
    subject: "s",
    intro: "<script>alert(1)</script>",
    action: "Go",
    url: 'https://x.test/?a=1&b="2"',
    outro: "o",
  });
  assert.doesNotMatch(email.html, /<script>/);
  assert.match(email.html, /href="https:\/\/x\.test\/\?a=1&amp;b=&quot;2&quot;"/);
  assert.match(email.text, /Go: https:\/\/x\.test\/\?a=1&b="2"/);
});

test("escapeHtml covers the five special characters", () => {
  assert.equal(escapeHtml(`&<>"'`), "&amp;&lt;&gt;&quot;&#39;");
});
