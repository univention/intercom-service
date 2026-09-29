/**
 * SPDX-License-Identifier: AGPL-3.0-only
 * SPDX-FileCopyrightText: 2024-2026 Univention GmbH
 */

const { redisClient, logger } = require("../utils");
const { sessionRollingDuration } = require("../config");

const EXPIRY_MARGIN_SECONDS = 60;

// The Redis client runs in legacy mode, so its commands report through callbacks.
const redisCommand = (command, ...args) =>
  new Promise((resolve, reject) => {
    redisClient[command](...args, (err, reply) => (err ? reject(err) : resolve(reply)));
  });

/**
 * Maps Keycloak's session_state to the ICS session cookie, so that a
 * back-channel logout can find the session. The key expires like the session
 * itself: every request extends it by the rolling session duration. The margin
 * covers the time until the session store saves the session at the end of the request.
 */
const updateSessionState = async (req, res, next) => {
  if (
    req.cookies &&
      "appSession" in req.cookies &&
      req.appSession &&
      "session_state" in req.appSession
  ) {
    logger.debug("Updating session state on redis");
    try {
      const sessionState = req.appSession["session_state"];
      const expiry = sessionRollingDuration + EXPIRY_MARGIN_SECONDS;
      await redisCommand("set", sessionState, req.cookies["appSession"], "EX", expiry);
    } catch (error) {
      logger.error(`Updating the session state on redis failed: ${error.message}`);
    }
  }
  next();
};

module.exports = {
  updateSessionState,
};
