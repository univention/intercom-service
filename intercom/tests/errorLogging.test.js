/**
 * SPDX-License-Identifier: AGPL-3.0-only
 * SPDX-FileCopyrightText: 2026 Univention GmbH
 */

/* eslint-env node */

const { test, before, after, beforeEach } = require("node:test");
const assert = require("node:assert");
const http = require("node:http");

const { listen } = require("./helpers");

const AS_SECRET = "matrix-as-secret-value";
const CLIENT_SECRET = "oidc-client-secret-value";
const SUBJECT_TOKEN = "users-subject-token-value";
const SECRETS = [AS_SECRET, CLIENT_SECRET, SUBJECT_TOKEN];

let upstream;
let logged = [];

before(async () => {
  // An upstream that rejects every request, like Keycloak or Synapse with wrong credentials.
  upstream = await listen(http.createServer((req, res) => {
    res.statusCode = 401;
    res.setHeader("content-type", "application/json");
    res.end(JSON.stringify({ error: "invalid_client", error_description: "Invalid client credentials" }));
  }));
  process.env.LOG_LEVEL = "debug";
  process.env.ISSUER_BASE_URL = `${upstream.url}/realms/test`;
  process.env.CLIENT_ID = "intercom";
  process.env.CLIENT_SECRET = CLIENT_SECRET;
  process.env.MATRIX_URL = upstream.url;
  process.env.MATRIX_SERVER_NAME = "matrix.test";
  process.env.MATRIX_AS_SECRET = AS_SECRET;

  const { logger } = require("../utils/logger");
  logger.transports.forEach((transport) => {
    transport.log = (info, callback) => {
      // The formatted line, exactly as the Console transport writes it.
      logged.push(info[Symbol.for("message")]);
      callback();
    };
  });
});

after(() => upstream.close());

beforeEach(() => {
  logged = [];
});

const assertNoSecrets = () => {
  const output = logged.join("\n");
  for (const secret of SECRETS) {
    assert.ok(!output.includes(secret), `the log contains ${secret}: ${output}`);
  }
};

test("a failing Matrix token request logs the reason, but not the application service secret", async () => {
  const { fetchMatrixToken } = require("../utils/matrix");
  assert.strictEqual(await fetchMatrixToken("alice"), undefined);
  assertNoSecrets();
  assert.match(logged.join("\n"), /Error fetching Matrix token: .*status 401, error invalid_client/);
});

test("a failing token exchange logs the reason, but not the client secret or the user's token", async () => {
  const { fetchOIDCToken } = require("../utils/keycloak");
  assert.strictEqual(await fetchOIDCToken(SUBJECT_TOKEN, "ncoidc"), undefined);
  assertNoSecrets();
  assert.match(logged.join("\n"), /Error fetching OIDC token for ncoidc: .*status 401, error invalid_client/);
});

test("a connection error is logged with its code, without the request data", async () => {
  const { matrix } = require("../config");
  const { fetchMatrixToken } = require("../utils/matrix");
  const url = matrix.url;
  matrix.url = "http://127.0.0.1:1";
  try {
    assert.strictEqual(await fetchMatrixToken("alice"), undefined);
  } finally {
    matrix.url = url;
  }
  assertNoSecrets();
  assert.match(logged.join("\n"), /Error fetching Matrix token: .*code ECONNREFUSED/);
});

test("describeError handles values that aren't errors", () => {
  const { describeError } = require("../utils/errors");
  assert.strictEqual(describeError("plain text"), "plain text");
  assert.strictEqual(describeError(new Error("boom")), "boom");
});
