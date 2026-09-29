/**
 * SPDX-License-Identifier: AGPL-3.0-only
 * SPDX-FileCopyrightText: 2026 Univention GmbH
 */

/* eslint-env node */

const { test, before, after } = require("node:test");
const assert = require("node:assert");
const { execFileSync, spawn } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const tls = require("node:tls");

const hasOpenssl = (() => {
  try {
    execFileSync("openssl", ["version"], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
})();

let dir;
let server;
let handshakes = 0;

before(async () => {
  if (!hasOpenssl) {
    return;
  }
  // A private CA and a Redis server certificate issued by it.
  dir = fs.mkdtempSync(path.join(os.tmpdir(), "ics-redis-tls-"));
  const file = (name) => path.join(dir, name);
  const openssl = (...args) => execFileSync("openssl", args, { stdio: "ignore" });
  openssl("req", "-x509", "-newkey", "rsa:2048", "-nodes", "-days", "1", "-subj", "/CN=Test Redis CA",
    "-keyout", file("ca.key"), "-out", file("ca.pem"));
  openssl("req", "-newkey", "rsa:2048", "-nodes", "-subj", "/CN=localhost",
    "-keyout", file("server.key"), "-out", file("server.csr"));
  openssl("req", "-x509", "-newkey", "rsa:2048", "-nodes", "-days", "1", "-subj", "/CN=Other CA",
    "-keyout", file("other-ca.key"), "-out", file("other-ca.pem"));
  fs.writeFileSync(file("ext.cnf"), "subjectAltName=IP:127.0.0.1,DNS:localhost\n");
  openssl("x509", "-req", "-in", file("server.csr"), "-CA", file("ca.pem"), "-CAkey", file("ca.key"),
    "-CAcreateserial", "-days", "1", "-extfile", file("ext.cnf"), "-out", file("server.pem"));

  server = tls.createServer({ key: fs.readFileSync(file("server.key")), cert: fs.readFileSync(file("server.pem")) },
    (socket) => {
      handshakes += 1;
      socket.destroy();
    });
  server.on("tlsClientError", () => {});
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
});

after(() => {
  server?.close();
  if (dir) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

// Loads utils/redis.js in a separate process, as the service does at startup,
// and reports whether the TLS handshake with the Redis server succeeded.
const connectsWith = async (env, { timeout = 1500 } = {}) => {
  const count = handshakes;
  const child = spawn(process.execPath, ["-e", "require('./utils/redis')"], {
    cwd: path.join(__dirname, ".."),
    env: {
      PATH: process.env.PATH,
      LOG_LEVEL: "error",
      ISSUER_BASE_URL: "https://id.example.test/realms/test",
      REDIS_SSL: "true",
      REDIS_HOST: "127.0.0.1",
      REDIS_PORT: String(server.address().port),
      REDIS_PASSWORD: "password",
      ...env,
    },
    stdio: "ignore",
  });
  const deadline = Date.now() + timeout;
  while (handshakes === count && Date.now() < deadline) {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  const connected = handshakes > count;
  // The service must still be running: a crash at startup would also mean no handshake.
  assert.strictEqual(child.exitCode, null, "the Redis client exited at startup");
  // Wait until the process is gone, so that its reconnects don't count for the next test.
  await new Promise((resolve) => {
    child.once("exit", resolve);
    child.kill();
  });
  return connected;
};

test("Redis over TLS works with the custom CA from NODE_EXTRA_CA_CERTS",
  { skip: !hasOpenssl && "openssl not available" }, async () => {
    const connected = await connectsWith({ NODE_EXTRA_CA_CERTS: path.join(dir, "ca.pem") }, { timeout: 10000 });
    assert.strictEqual(connected, true);
  });

test("Redis over TLS rejects a server certificate that isn't trusted",
  { skip: !hasOpenssl && "openssl not available" }, async () => {
    assert.strictEqual(await connectsWith({}), false);
  });

test("Redis over TLS rejects a server certificate of another CA, even with a custom CA configured",
  { skip: !hasOpenssl && "openssl not available" }, async () => {
    assert.strictEqual(await connectsWith({ NODE_EXTRA_CA_CERTS: path.join(dir, "other-ca.pem") }), false);
  });
