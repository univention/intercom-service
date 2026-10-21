/**
 * SPDX-License-Identifier: AGPL-3.0-only
 * SPDX-FileCopyrightText: 2026 Univention GmbH
 */

/* eslint-env node */

const { test, before, after } = require("node:test");
const assert = require("node:assert");
const http = require("node:http");
const express = require("express");

const { stubRedis, listen } = require("./helpers");

const warnings = [];
let restoreWarn;

let backend;
let backendCookies;
let ics;

before(async () => {
  backend = await listen(http.createServer((req, res) => {
    backendCookies.push(req.headers.cookie);
    res.end("ok");
  }));
  process.env.LOG_LEVEL = "error";
  process.env.ISSUER_BASE_URL = "https://id.example.test/realms/test";
  process.env.NC_URL = backend.url;
  stubRedis();
  const { logger } = require("../utils/logger");
  const warn = logger.warn;
  restoreWarn = () => (logger.warn = warn);
  logger.warn = (...args) => {
    warnings.push(args);
    return warn.apply(logger, args);
  };

  const app = express();
  app.use((req, res, next) => {
    req.appSession = { nc_access_token: "nc-token" };
    next();
  });
  app.use("/fs", require("../routes/fs"));
  ics = await listen(app);
});

after(async () => {
  restoreWarn();
  await ics.close();
  await backend.close();
});

const cookieAtBackend = async (cookieHeader) => {
  backendCookies = [];
  const headers = cookieHeader === undefined ? {} : { cookie: cookieHeader };
  const res = await fetch(`${ics.url}/fs/remote.php/dav/files/user/`, { headers });
  assert.strictEqual(res.status, 200);
  assert.strictEqual(backendCookies.length, 1);
  return backendCookies[0];
};

test("the session cookie isn't forwarded when it is the only cookie", async () => {
  assert.strictEqual(await cookieAtBackend("appSession=session-id"), undefined);
});

test("the session cookie and the other ICS cookies are removed, backend cookies are kept", async () => {
  const forwarded = await cookieAtBackend(
    "appSession=session-id; _csrf_token=csrf; skipSilentLogin=true; auth_verification=a; " +
      "_auth_verification=b; nc_session_id=nc; oc_sessionPassphrase=pass",
  );
  assert.strictEqual(forwarded, "nc_session_id=nc; oc_sessionPassphrase=pass");
});

test("chunked session cookies are removed", async () => {
  assert.strictEqual(await cookieAtBackend("appSession.0=part-0; appSession.1=part-1"), undefined);
});

test("only ICS cookies result in no Cookie header at all", async () => {
  assert.strictEqual(await cookieAtBackend("_csrf_token=csrf; skipSilentLogin=true"), undefined);
});

test("a request without Cookie header is proxied without one and without a warning", async () => {
  warnings.length = 0;
  assert.strictEqual(await cookieAtBackend(undefined), undefined);
  assert.deepStrictEqual(warnings, []);
});

test("stripIntercomCookies handles a missing Cookie header synchronously", () => {
  const { stripIntercomCookies } = require("../utils/cookies");
  const calls = [];
  const proxyReq = {
    getHeader: () => undefined,
    setHeader: (...args) => calls.push(["setHeader", ...args]),
    removeHeader: (...args) => calls.push(["removeHeader", ...args]),
  };
  assert.strictEqual(stripIntercomCookies(proxyReq), undefined);
  assert.deepStrictEqual(calls, []);
});

test("a Cookie header that can't be processed is dropped with a warning", async () => {
  warnings.length = 0;
  assert.strictEqual(await cookieAtBackend("=x; appSession=session-id; nc_session_id=nc"), undefined);
  assert.strictEqual(warnings.length, 1);
});
