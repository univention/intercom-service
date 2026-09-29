/**
 * SPDX-License-Identifier: AGPL-3.0-only
 * SPDX-FileCopyrightText: 2024-2026 Univention GmbH
 */

const express = require("express");
const router = express.Router();

const jose = require("jose");

const { issuerBaseUrl } = require("../config");
const { JWKS, redisClient, logger } = require("../utils");

// The Redis client runs in legacy mode, so its commands report through callbacks.
const redisCommand = (command, ...args) =>
  new Promise((resolve, reject) => {
    redisClient[command](...args, (err, reply) => (err ? reject(err) : resolve(reply)));
  });

/**
 * @name /backchannel-logout
 * @desc
 * OpenID Connect Backchannel Logout implementation to delete the session from the store
 * @see {@link https://openid.net/specs/openid-connect-backchannel-1_0.html#BCResponse}
 */
router.post("/", async (req, res) => {
  res.set("Cache-Control", "no-store");

  const logoutToken = req.body?.logout_token;
  if (typeof logoutToken !== "string" || logoutToken === "") {
    logger.warn("Rejected backchannel logout: no logout_token");
    res.status(400).json({ error: "invalid_request" });
    return;
  }

  let payload;
  try {
    // decode and validates claims set
    ({ payload } = await jose.jwtVerify(logoutToken, JWKS, {
      issuer: issuerBaseUrl,
      maxTokenAge: "10 seconds", // TODO: to avoid replay attack too far after issued_at
    }));
  } catch (error) {
    logger.warn(`Rejected backchannel logout token: ${error.code ?? error.message}`);
    res.status(400).json({ error: "invalid_request" });
    return;
  }
  // Sessions are mapped by sid; logout tokens with only a sub can't be processed.
  if (typeof payload.sid !== "string" || payload.sid === "") {
    logger.warn("Rejected backchannel logout token: no sid claim");
    res.status(400).json({ error: "invalid_request" });
    return;
  }

  try {
    const sessionId = await redisCommand("get", payload.sid);
    if (sessionId) {
      await redisCommand("del", "sess:" + sessionId);
    }
    await redisCommand("del", payload.sid);
  } catch (error) {
    logger.error(`Backchannel logout failed: ${error.message}`);
    res.status(500).json({ error: "server_error" });
    return;
  }
  logger.info("Backchannel logout");
  res.send("Done");
});

module.exports = router;
