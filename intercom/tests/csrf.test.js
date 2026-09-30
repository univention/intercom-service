/**
 * SPDX-License-Identifier: AGPL-3.0-only
 * SPDX-FileCopyrightText: 2026 Univention GmbH
 */

/* eslint-env node */

const { test, before, after } = require("node:test");
const assert = require("node:assert");
const express = require("express");
const cookieParser = require("cookie-parser");
const csrfDSC = require("express-csrf-double-submit-cookie");

const { stubRedis, listen } = require("./helpers");

process.env.LOG_LEVEL = "error";
process.env.ISSUER_BASE_URL = "https://id.example.test/realms/test";
process.env.ORIGIN_REGEX = "^https://portal\\.example\\.test$";
process.env.BASE_URL = "https://ics.example.test";

let server;
let reached;

before(async () => {
  stubRedis();
  const { requireCsrfTokenOrAllowedOrigin } = require("../middlewares/csrf");
  const app = express();
  app.use(cookieParser());
  app.use(csrfDSC({ cookie: { sameSite: "none", secure: true } }));
  app.use("/fs", requireCsrfTokenOrAllowedOrigin, (req, res) => {
    reached = true;
    res.send("proxied");
  });
  server = await listen(app);
});

after(() => server.close());

const request = async (method, headers = {}) => {
  reached = false;
  const res = await fetch(`${server.url}/fs/ocs/v2.php/apps/files_sharing/api/v1/shares`, { method, headers });
  return res.status;
};

const withToken = { cookie: "_csrf_token=t0ken", "x-csrf-token": "t0ken" };

test("a forged POST from another page is rejected and doesn't reach the backend", async () => {
  assert.strictEqual(await request("POST", { origin: "https://evil.test" }), 403);
  assert.strictEqual(reached, false);
});

test("state-changing WebDAV methods are checked, too", async () => {
  for (const method of ["PUT", "DELETE", "PROPFIND", "MKCOL", "MOVE"]) {
    assert.strictEqual(await request(method, { origin: "https://evil.test" }), 403, method);
  }
});

test("a POST without Origin and Referer is rejected", async () => {
  assert.strictEqual(await request("POST"), 403);
});

test("an opaque origin (sandboxed page) is rejected", async () => {
  assert.strictEqual(await request("POST", { origin: "null" }), 403);
});

test("a POST from an origin matching ORIGIN_REGEX passes", async () => {
  assert.strictEqual(await request("POST", { origin: "https://portal.example.test" }), 200);
  assert.strictEqual(reached, true);
});

test("a POST from ICS itself passes", async () => {
  assert.strictEqual(await request("POST", { origin: "https://ics.example.test" }), 200);
});

test("without Origin header, an allowed Referer passes", async () => {
  assert.strictEqual(await request("POST", { referer: "https://portal.example.test/appsuite/" }), 200);
});

test("a valid CSRF token passes, whatever the origin", async () => {
  assert.strictEqual(await request("POST", { ...withToken, origin: "https://evil.test" }), 200);
});

test("a wrong CSRF token doesn't help a forged request", async () => {
  const headers = { cookie: "_csrf_token=t0ken", "x-csrf-token": "other", origin: "https://evil.test" };
  assert.strictEqual(await request("POST", headers), 403);
});

test("safe methods aren't checked", async () => {
  for (const method of ["GET", "HEAD", "OPTIONS"]) {
    assert.strictEqual(await request(method, { origin: "https://evil.test" }), 200, method);
  }
});

test("an empty ORIGIN_REGEX allows no origin, only the token", async () => {
  const { corsOptions } = require("../config");
  const origin = corsOptions.origin;
  corsOptions.origin = new RegExp("");
  try {
    assert.strictEqual(await request("POST", { origin: "https://portal.example.test" }), 403);
    assert.strictEqual(await request("POST", { origin: "https://ics.example.test" }), 200);
    assert.strictEqual(await request("POST", { ...withToken, origin: "https://evil.test" }), 200);
  } finally {
    corsOptions.origin = origin;
  }
});
