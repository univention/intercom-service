/**
 * SPDX-License-Identifier: AGPL-3.0-only
 * SPDX-FileCopyrightText: 2026 Univention GmbH
 */

/* eslint-env node */

const { test, before, after } = require("node:test");
const assert = require("node:assert");
const net = require("node:net");
const path = require("node:path");
const { spawn } = require("node:child_process");

let server;
let received = "";

before(async () => {
  // A minimal Redis stand-in: records the commands and answers each with OK.
  server = net.createServer((socket) => {
    socket.on("data", (data) => {
      received += data.toString();
      const commands = (data.toString().match(/^\*\d+\r\n/gm) ?? []).length;
      socket.write("+OK\r\n".repeat(commands));
    });
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
});

after(() => server.close());

// Loads utils/redis.js in a separate process, as the service does at startup,
// and returns the commands the Redis server received.
const commandsWith = async (env, { until = () => false, timeout = 1000 } = {}) => {
  received = "";
  const child = spawn(process.execPath, ["-e", "require('./utils/redis')"], {
    cwd: path.join(__dirname, ".."),
    env: {
      PATH: process.env.PATH,
      LOG_LEVEL: "error",
      ISSUER_BASE_URL: "https://id.example.test/realms/test",
      REDIS_HOST: "127.0.0.1",
      REDIS_PORT: String(server.address().port),
      ...env,
    },
    stdio: ["ignore", "ignore", "pipe"],
  });
  let stderr = "";
  child.stderr.on("data", (data) => (stderr += data));
  const deadline = Date.now() + timeout;
  while (!until(received) && Date.now() < deadline) {
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  // The service must still be running: a crash at startup would also send no AUTH.
  assert.strictEqual(child.exitCode, null, `the Redis client exited at startup: ${stderr}`);
  await new Promise((resolve) => {
    child.once("exit", resolve);
    child.kill();
  });
  return received;
};

const hasAuth = (commands) => commands.includes("AUTH");
const bulk = (value) => `$${Buffer.byteLength(value)}\r\n${value}\r\n`;

test("a password with URL special characters is sent unchanged", async () => {
  const password = "p@ss:w/rd#1%?";
  const commands = await commandsWith({ REDIS_PASSWORD: password }, { until: hasAuth, timeout: 10000 });
  assert.ok(commands.includes(`${bulk("AUTH")}${bulk("default")}${bulk(password)}`), commands);
});

test("a custom Redis user is used with the password", async () => {
  const env = { REDIS_USER: "ics", REDIS_PASSWORD: "secret" };
  const commands = await commandsWith(env, { until: hasAuth, timeout: 10000 });
  assert.ok(commands.includes(`${bulk("AUTH")}${bulk("ics")}${bulk("secret")}`), commands);
});

test("without password, no AUTH is sent (and never the password \"undefined\")", async () => {
  const commands = await commandsWith({});
  assert.ok(!commands.includes("AUTH"), commands);
  assert.ok(!commands.includes("undefined"), commands);
});
