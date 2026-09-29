/**
 * SPDX-License-Identifier: AGPL-3.0-only
 * SPDX-FileCopyrightText: 2026 Univention GmbH
 */

/* eslint-env node */

const { test, before, after } = require("node:test");
const assert = require("node:assert");
const express = require("express");
const jose = require("jose");

const { stubModule } = require("./helpers");

const ISSUER = "https://id.example.test/realms/test";

let app;
let server;
let url;
let privateKey;
const sessions = new Map();

before(async () => {
  Object.assign(process.env, {
    LOG_LEVEL: "error",
    PORT: "0",
    ISSUER_BASE_URL: ISSUER,
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
  const keyPair = await jose.generateKeyPair("RS256");
  privateKey = keyPair.privateKey;
  const jwk = { ...(await jose.exportJWK(keyPair.publicKey)), kid: "test", alg: "RS256" };
  stubModule("utils/keys.js", { JWKS: jose.createLocalJWKSet({ keys: [jwk] }) });
  sessions.set("sid-1", "cookie-1");
  const callback = (args) => args.find((arg) => typeof arg === "function");
  const redisClient = {
    get: (key, ...args) => callback(args)(null, sessions.get(key) ?? null),
    set: (key, value, ...args) => callback(args)?.(null, "OK"),
    del: (key, ...args) => {
      const deleted = sessions.delete(key) ? 1 : 0;
      callback(args)?.(null, deleted);
    },
  };
  const redisStore = {
    get: (sid, cb) => cb(null, null),
    set: (sid, data, cb) => cb(null),
    destroy: (sid, cb) => cb(null),
  };
  stubModule("utils/redis.js", { redisClient, redisStore });

  // Start the real app on a random local port.
  const listen = express.application.listen;
  express.application.listen = function (port, onListening) {
    app = this;
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

// Walks the middleware stack of the app and its routers. This uses Express 4 internals (app._router, layer
// names); express-openid-connect's own parsers are attached to single routes and aren't part of it.
const bodyParserMounts = (stack, prefix = "") =>
  stack.flatMap((layer) => {
    if (layer.name === "urlencodedParser" || layer.name === "jsonParser") {
      return [`${prefix}${layer.regexp}`];
    }
    return layer.handle?.stack ? bodyParserMounts(layer.handle.stack, `${prefix}${layer.regexp} > `) : [];
  });

test("no body parser runs before the proxies, only /backchannel-logout parses its body", () => {
  const mounts = bodyParserMounts(app._router.stack);
  assert.ok(mounts.length > 0);
  for (const mount of mounts) {
    assert.match(mount, /^\/\^\\\/backchannel-logout/, `body parser mounted at ${mount}`);
  }
});

test("/backchannel-logout still reads the logout_token from the form body", async () => {
  // A logout token as Keycloak sends it.
  const events = { "http://schemas.openid.net/event/backchannel-logout": {} };
  const token = await new jose.SignJWT({ sid: "sid-1", jti: "jti-1", events })
    .setProtectedHeader({ alg: "RS256", kid: "test", typ: "logout+jwt" })
    .setIssuer(ISSUER)
    .setAudience("intercom")
    .setIssuedAt()
    .sign(privateKey);
  const res = await fetch(`${url}/backchannel-logout`, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ logout_token: token }),
  });
  assert.strictEqual(res.status, 200);
  assert.ok(!sessions.has("sid-1"));
});
