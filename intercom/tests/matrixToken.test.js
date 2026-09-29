/**
 * SPDX-License-Identifier: AGPL-3.0-only
 * SPDX-FileCopyrightText: 2026 Univention GmbH
 */

/* eslint-env node */

const { test, before, after, beforeEach } = require("node:test");
const assert = require("node:assert");
const express = require("express");
const jose = require("jose");

const { stubModule, stubRedis, listen } = require("./helpers");

const ISSUER = "https://id.example.test/realms/test";
Object.assign(process.env, { LOG_LEVEL: "error", ISSUER_BASE_URL: ISSUER, MATRIX_ENABLED: "true" });

let privateKey;
let server;
let fetchedFor;
let matrixAnswer;
let reached;
const logged = [];

before(async () => {
  const keyPair = await jose.generateKeyPair("RS256");
  privateKey = keyPair.privateKey;
  const jwk = { ...(await jose.exportJWK(keyPair.publicKey)), kid: "test", alg: "RS256" };
  stubModule("utils/keys.js", { JWKS: jose.createLocalJWKSet({ keys: [jwk] }) });
  stubModule("utils/matrix.js", {
    fetchMatrixToken: async (userId) => {
      fetchedFor.push(userId);
      return matrixAnswer;
    },
  });
  stubRedis();
  const { logger } = require("../utils/logger");
  for (const level of ["info", "warn", "error"]) {
    logger[level] = (...args) => logged.push([level, ...args].join(" "));
  }
  const { refreshMatrixTokenIfNeeded, requireMatrixToken } = require("../middlewares/tokenRenewal");

  const app = express();
  app.use(express.json());
  app.post("/nob", (req, res, next) => {
    req.appSession = { id_token: req.body.idToken };
    if (req.body.matrixToken) {
      req.appSession.matrix_access_token = req.body.matrixToken;
    }
    // As in production, the access token doesn't necessarily carry the claim.
    req.decodedAccessToken = {};
    next();
  }, refreshMatrixTokenIfNeeded, requireMatrixToken, (req, res) => {
    reached = true;
    res.send("proxied");
  });
  server = await listen(app);
});

after(() => server.close());

beforeEach(() => {
  fetchedFor = [];
  matrixAnswer = { openIdToken: { access_token: "openid" }, expiresAt: Date.now() + 3600 * 1000 };
  reached = false;
  logged.length = 0;
});

const idToken = (claims) =>
  new jose.SignJWT(claims)
    .setProtectedHeader({ alg: "RS256", kid: "test" })
    .setIssuer(ISSUER)
    .setIssuedAt()
    .setExpirationTime("5m")
    .sign(privateKey);

const post = async (claims, matrixToken) =>
  fetch(`${server.url}/nob`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ idToken: await idToken(claims), matrixToken }),
  });

test("the Matrix user ID is taken from the ID token, as at login", async () => {
  const res = await post({ entryuuid: "uuid-1" });
  assert.strictEqual(res.status, 200);
  assert.deepStrictEqual(fetchedFor, ["uuid-1"]);
  assert.strictEqual(reached, true);
});

test("an ID token without the claim is reported clearly and the request isn't forwarded", async () => {
  const res = await post({ sub: "user-1" });
  assert.strictEqual(res.status, 502);
  assert.deepStrictEqual(await res.json(), { error: "matrix_token_unavailable" });
  assert.deepStrictEqual(fetchedFor, []);
  assert.strictEqual(reached, false);
  assert.ok(logged.some((line) => line.startsWith("error")), logged.join("\n"));
});

test("a failed Matrix token request isn't logged as success and the request isn't forwarded", async () => {
  matrixAnswer = undefined;
  const res = await post({ entryuuid: "uuid-1" });
  assert.strictEqual(res.status, 502);
  assert.ok(!logged.some((line) => line.includes("successfully")), logged.join("\n"));
});

test("a Matrix token that is still valid isn't fetched again", async () => {
  const valid = { openIdToken: { access_token: "openid" }, expiresAt: Date.now() + 3600 * 1000 };
  const res = await post({ entryuuid: "uuid-1" }, valid);
  assert.strictEqual(res.status, 200);
  assert.deepStrictEqual(fetchedFor, []);
});

test("requests pass without a Matrix token if Matrix is disabled", async () => {
  const { matrix } = require("../config");
  matrix.enabled = false;
  try {
    matrixAnswer = undefined;
    const res = await post({ entryuuid: "uuid-1" });
    assert.strictEqual(res.status, 200);
    assert.deepStrictEqual(fetchedFor, []);
  } finally {
    matrix.enabled = true;
  }
});
