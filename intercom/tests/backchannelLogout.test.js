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
const CLIENT_ID = "intercom";
const LOGOUT_EVENT = { "http://schemas.openid.net/event/backchannel-logout": {} };
process.env.ISSUER_BASE_URL = ISSUER;
process.env.CLIENT_ID = CLIENT_ID;
process.env.LOG_LEVEL = "error";

let redisClient;
let privateKey;
let server;

before(async () => {
  const keyPair = await jose.generateKeyPair("RS256");
  privateKey = keyPair.privateKey;
  const jwk = { ...(await jose.exportJWK(keyPair.publicKey)), kid: "test", alg: "RS256" };
  stubModule("utils/keys.js", { JWKS: jose.createLocalJWKSet({ keys: [jwk] }) });
  redisClient = stubRedis();

  const app = express();
  app.use(express.urlencoded({ extended: true }));
  app.use("/backchannel-logout", require("../routes/backchannelLogout"));
  server = await listen(app);
});

after(() => server.close());

beforeEach(() => {
  redisClient.store.clear();
  redisClient.calls.length = 0;
  redisClient.store.set("sid-1", { value: "cookie-1" });
  redisClient.store.set("sess:cookie-1", { value: "{}" });
});

const logoutToken = (claims = {}, iat = Math.floor(Date.now() / 1000)) => {
  const payload = { aud: CLIENT_ID, sid: "sid-1", jti: "jti-1", events: LOGOUT_EVENT, ...claims };
  // A claim set to undefined is left out of the token.
  Object.keys(payload).forEach((key) => payload[key] === undefined && delete payload[key]);
  return new jose.SignJWT(payload)
    .setProtectedHeader({ alg: "RS256", kid: "test", typ: "logout+jwt" })
    .setIssuer(ISSUER)
    .setIssuedAt(iat)
    .sign(privateKey);
};

const postLogout = (body) =>
  fetch(`${server.url}/backchannel-logout`, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(body),
  });

test("a garbage logout_token is rejected with 400", async () => {
  const res = await postLogout({ logout_token: "garbage" });
  assert.strictEqual(res.status, 400);
  assert.strictEqual(res.headers.get("cache-control"), "no-store");
  assert.ok(redisClient.store.has("sess:cookie-1"));
});

test("a missing logout_token is rejected with 400", async () => {
  const res = await postLogout({});
  assert.strictEqual(res.status, 400);
});

test("a logout_token older than 10 seconds is rejected with 400", async () => {
  const res = await postLogout({ logout_token: await logoutToken({}, Math.floor(Date.now() / 1000) - 60) });
  assert.strictEqual(res.status, 400);
  assert.ok(redisClient.store.has("sess:cookie-1"));
});

test("a logout_token signed by an unknown key is rejected with 400", async () => {
  const { privateKey: otherKey } = await jose.generateKeyPair("RS256");
  const token = await new jose.SignJWT({ sid: "sid-1", jti: "jti-1", events: LOGOUT_EVENT })
    .setProtectedHeader({ alg: "RS256", kid: "test" })
    .setIssuer(ISSUER)
    .setAudience(CLIENT_ID)
    .setIssuedAt()
    .sign(otherKey);
  const res = await postLogout({ logout_token: token });
  assert.strictEqual(res.status, 400);
});

const rejectedClaims = {
  "a token issued for another client": { aud: "other-client" },
  "a token without the back-channel logout event": { events: undefined },
  "a token with a different event": { events: { "https://example.test/other-event": {} } },
  "a token whose event member is not an object": { events: { [Object.keys(LOGOUT_EVENT)[0]]: null } },
  "a token with a nonce (an ID token)": { nonce: "n-1" },
  "a token without sid": { sid: undefined, sub: "user-1" },
  "a token without jti": { jti: undefined },
};

for (const [name, claims] of Object.entries(rejectedClaims)) {
  test(`${name} is rejected with 400 and the session is kept`, async () => {
    const token = await logoutToken(claims);
    const res = await postLogout({ logout_token: token });
    assert.strictEqual(res.status, 400);
    assert.ok(redisClient.store.has("sess:cookie-1"));
  });
}

test("a logout_token for an unknown sid is answered with 200", async () => {
  const res = await postLogout({ logout_token: await logoutToken({ sid: "sid-unknown" }) });
  assert.strictEqual(res.status, 200);
  assert.ok(redisClient.store.has("sess:cookie-1"));
  assert.ok(!redisClient.calls.some(([command, key]) => command === "del" && key.startsWith("sess:")));
});

test("a valid logout_token deletes the session", async () => {
  const res = await postLogout({ logout_token: await logoutToken() });
  assert.strictEqual(res.status, 200);
  assert.ok(!redisClient.store.has("sess:cookie-1"));
  assert.ok(!redisClient.store.has("sid-1"));
});

test("a logout_token whose aud array contains the client ID is accepted", async () => {
  const res = await postLogout({ logout_token: await logoutToken({ aud: ["other-client", CLIENT_ID] }) });
  assert.strictEqual(res.status, 200);
  assert.ok(!redisClient.store.has("sess:cookie-1"));
});

test("a Redis error is answered with 500 instead of crashing", async () => {
  const get = redisClient.get;
  redisClient.get = (key, callback) => callback(new Error("connection lost"));
  try {
    const res = await postLogout({ logout_token: await logoutToken() });
    assert.strictEqual(res.status, 500);
  } finally {
    redisClient.get = get;
  }
});

test("the service still answers after rejected logout requests", async () => {
  await postLogout({ logout_token: "garbage" });
  const res = await postLogout({ logout_token: await logoutToken() });
  assert.strictEqual(res.status, 200);
});
