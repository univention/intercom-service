/**
 * SPDX-License-Identifier: AGPL-3.0-only
 * SPDX-FileCopyrightText: 2026 Univention GmbH
 */

/* eslint-env node */

const { test, before, after } = require("node:test");
const assert = require("node:assert");
const express = require("express");

const { stubModule } = require("./helpers");

let server;
let url;

before(async () => {
  Object.assign(process.env, {
    LOG_LEVEL: "error",
    PORT: "0",
    // Unreachable, so that the login fails with an error inside the app.
    ISSUER_BASE_URL: "http://127.0.0.1:1/realms/test",
    BASE_URL: "https://ics.example.test",
    CLIENT_ID: "intercom",
    CLIENT_SECRET: "client-secret",
    SECRET: "session-secret-session-secret-12",
    ORIGIN_REGEX: "^https://portal\\.example\\.test$",
    NC_URL: "http://127.0.0.1:1",
    XWIKI_URL: "http://127.0.0.1:1",
    NORDECK_URL: "http://127.0.0.1:1",
    PORTAL_URL: "http://127.0.0.1:1",
  });
  const callback = (args) => args.find((arg) => typeof arg === "function");
  stubModule("utils/redis.js", {
    redisClient: { get: (key, ...args) => callback(args)?.(null, null), set: () => {}, del: () => {} },
    redisStore: { get: (sid, cb) => cb(null, null), set: (sid, data, cb) => cb(null), destroy: (sid, cb) => cb(null) },
  });

  // Start the real app on a random local port.
  const listen = express.application.listen;
  express.application.listen = function (port, onListening) {
    server = listen.call(this, 0, "127.0.0.1", onListening);
    return server;
  };
  try {
    require("../app");
  } finally {
    express.application.listen = listen;
  }
  await new Promise((resolve) => (server.listening ? resolve() : server.once("listening", resolve)));
  url = `http://127.0.0.1:${server.address().port}`;
});

after(() => new Promise((resolve) => server.close(resolve)));

test("errors are answered without stack trace or internal details", async () => {
  // The silent login needs the issuer's discovery document, which can't be fetched.
  const res = await fetch(`${url}/silent`, { redirect: "manual" });
  const body = await res.text();
  assert.strictEqual(res.status, 500);
  assert.deepStrictEqual(JSON.parse(body), { error: "Internal Server Error" });
  assert.doesNotMatch(body, /at .*\.js:\d+/);
});

test("client errors keep their message, without stack trace", async () => {
  // The body parser of /backchannel-logout rejects bodies over 100 kB.
  const res = await fetch(`${url}/backchannel-logout`, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: `logout_token=${"x".repeat(200 * 1024)}`,
  });
  const body = await res.text();
  assert.strictEqual(res.status, 413);
  assert.deepStrictEqual(JSON.parse(body), { error: "request entity too large" });
  assert.doesNotMatch(body, /at .*\.js:\d+/);
});

test("responses don't reveal the framework and carry basic security headers", async () => {
  const res = await fetch(url);
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.headers.get("x-powered-by"), null);
  assert.strictEqual(res.headers.get("x-content-type-options"), "nosniff");
  assert.strictEqual(res.headers.get("referrer-policy"), "strict-origin-when-cross-origin");
});

test("unknown paths get a 404 with security headers", async () => {
  const res = await fetch(`${url}/does-not-exist`);
  assert.strictEqual(res.status, 404);
  assert.strictEqual(res.headers.get("x-content-type-options"), "nosniff");
});
