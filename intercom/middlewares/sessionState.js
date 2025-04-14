/**
 * SPDX-License-Identifier: AGPL-3.0-only
 * SPDX-FileCopyrightText: 2024-2025 Univention GmbH
 */

const { redisClient, logger } = require("../utils");

const updateSessionState = async (req, res, next) => {
  if (
    req.cookies &&
      "appSession" in req.cookies &&
      req.appSession &&
      "session_state" in req.appSession
  ) {
    logger.debug("Updating session state on redis");
    await redisClient.set(req.appSession["session_state"], req.cookies["appSession"]);
  }
  next();
};


module.exports = {
  updateSessionState,
};
