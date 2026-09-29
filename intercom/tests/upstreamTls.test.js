/**
 * SPDX-License-Identifier: AGPL-3.0-only
 * SPDX-FileCopyrightText: 2026 Univention GmbH
 */

/* eslint-env node */

const { test, before, after } = require("node:test");
const assert = require("node:assert");
const { execFileSync } = require("node:child_process");
const fs = require("node:fs");
const https = require("node:https");
const os = require("node:os");
const path = require("node:path");
const express = require("express");

const { stubRedis, listen } = require("./helpers");

const hasOpenssl = (() => {
  try {
    execFileSync("openssl", ["version"], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
})();

let upstream;
let upstreamRequests = 0;
let ics;

before(async () => {
  if (!hasOpenssl) {
    return;
  }
  // An upstream with a self-signed certificate that nothing trusts.
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "ics-tls-"));
  let tls;
  try {
    execFileSync("openssl", ["req", "-x509", "-newkey", "rsa:2048", "-nodes", "-days", "1",
      "-subj", "/CN=localhost", "-addext", "subjectAltName=IP:127.0.0.1",
      "-keyout", path.join(dir, "key.pem"), "-out", path.join(dir, "cert.pem")], { stdio: "ignore" });
    tls = { key: fs.readFileSync(path.join(dir, "key.pem")), cert: fs.readFileSync(path.join(dir, "cert.pem")) };
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
  const server = https.createServer(tls, (req, res) => {
    upstreamRequests += 1;
    res.end("{}");
  });
  upstream = await listen(server);
  upstream.url = upstream.url.replace("http:", "https:");

  process.env.LOG_LEVEL = "error";
  process.env.ISSUER_BASE_URL = "https://id.example.test/realms/test";
  process.env.MATRIX_URL = upstream.url;
  process.env.MATRIX_SERVER_NAME = "matrix.test";
  process.env.MATRIX_AS_SECRET = "as-secret";
  process.env.NORDECK_URL = upstream.url;
  stubRedis();

  const app = express();
  app.use((req, res, next) => {
    req.appSession = { matrix_access_token: { openIdToken: { access_token: "openid-token" } } };
    next();
  });
  app.use("/nob", require("../routes/nob"));
  ics = await listen(app);
});

after(async () => {
  await ics?.close();
  await upstream?.close();
});

test("the Matrix app-service token isn't sent to an upstream with an untrusted certificate",
  { skip: !hasOpenssl && "openssl not available" }, async () => {
    const { fetchMatrixToken } = require("../utils/matrix");
    const seen = upstreamRequests;
    assert.strictEqual(await fetchMatrixToken("alice"), undefined);
    assert.strictEqual(upstreamRequests, seen);
  });

test("the /nob proxy doesn't forward to an upstream with an untrusted certificate",
  { skip: !hasOpenssl && "openssl not available" }, async () => {
    const seen = upstreamRequests;
    const res = await fetch(`${ics.url}/nob/v1/config`);
    assert.ok(res.status >= 500, `expected a proxy error, got ${res.status}`);
    assert.strictEqual(upstreamRequests, seen);
  });
