/**
 * SPDX-License-Identifier: AGPL-3.0-only
 * SPDX-FileCopyrightText: 2026 Univention GmbH
 */

/* eslint-env node */

const { test, before, after, beforeEach } = require("node:test");
const assert = require("node:assert");
const express = require("express");
const cookieParser = require("cookie-parser");

const { stubRedis, listen } = require("./helpers");

process.env.LOG_LEVEL = "error";
process.env.ISSUER_BASE_URL = "https://id.example.test/realms/test";
process.env.SESSION_ROLLING_DURATION = "3600";

let redisClient;
let server;

before(async () => {
  redisClient = stubRedis();
  const { updateSessionState } = require("../middlewares/sessionState");
  const app = express();
  app.use(cookieParser());
  app.use((req, res, next) => {
    req.appSession = req.get("x-no-session") ? {} : { session_state: "keycloak-session-1" };
    next();
  });
  app.use(updateSessionState);
  app.get("/", (req, res) => res.send("ok"));
  server = await listen(app);
});

after(() => server.close());

beforeEach(() => {
  redisClient.store.clear();
  redisClient.calls.length = 0;
});

const get = (path, headers = {}) =>
  fetch(`${server.url}${path}`, { headers: { cookie: "appSession=session-id-1", ...headers } });

test("the session state mapping expires with the rolling session duration", async () => {
  assert.strictEqual((await get("/")).status, 200);
  const entry = redisClient.store.get("keycloak-session-1");
  assert.strictEqual(entry.value, "session-id-1");
  // The rolling session duration plus a margin for the time until the session is saved.
  assert.deepStrictEqual(entry.options, ["EX", 3660]);
});

test("every request extends the expiry", async () => {
  await get("/");
  await get("/");
  const sets = redisClient.calls.filter(([command]) => command === "set");
  assert.strictEqual(sets.length, 2);
  assert.deepStrictEqual(sets, [
    ["set", "keycloak-session-1", "session-id-1", "EX", 3660],
    ["set", "keycloak-session-1", "session-id-1", "EX", 3660],
  ]);
});

test("requests without session state don't write anything", async () => {
  await get("/", { "x-no-session": "1" });
  assert.deepStrictEqual(redisClient.calls, []);
});

test("a Redis error doesn't fail or crash the request", async () => {
  const set = redisClient.set;
  redisClient.set = (...args) => args.find((arg) => typeof arg === "function")(new Error("connection lost"));
  try {
    assert.strictEqual((await get("/")).status, 200);
  } finally {
    redisClient.set = set;
  }
});
