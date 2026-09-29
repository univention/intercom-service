/**
 * SPDX-License-Identifier: AGPL-3.0-only
 * SPDX-FileCopyrightText: 2026 Univention GmbH
 */

const { logger } = require("../utils");

/**
 * Answers errors without stack traces or other internal details. Must be
 * registered after all routes.
 */
const errorHandler = (err, req, res, next) => {
  const code = err.status ?? err.statusCode;
  const status = Number.isInteger(code) && code >= 400 && code < 600 ? code : 500;
  if (status >= 500) {
    logger.error(`Request ${req.method} ${req.baseUrl}${req.path} failed: ${err.message}`);
    logger.debug(err.stack);
  }
  if (res.headersSent) {
    // Let Express abort the response instead of ending it as if it were complete.
    next(err);
    return;
  }
  const message = status < 500 && err.expose ? err.message : "Internal Server Error";
  res.status(status).json({ error: message });
};

module.exports = {
  errorHandler,
};
