/**
 * SPDX-License-Identifier: AGPL-3.0-only
 * SPDX-FileCopyrightText: 2026 Univention GmbH
 */

const { corsOptions, intercom } = require("../config");
const { logger } = require("../utils");

// Methods without side effects. All others, including WebDAV methods, are checked.
const SAFE_METHODS = ["GET", "HEAD", "OPTIONS"];

const originOf = (value) => {
  try {
    return new URL(value).origin;
  } catch {
    return undefined;
  }
};

const isAllowedOrigin = (origin) => {
  if (origin === undefined || origin === "null") {
    return false;
  }
  if (origin === originOf(intercom.baseUrl)) {
    return true;
  }
  // An empty ORIGIN_REGEX matches every origin, so it can't be used to trust any of them.
  const regex = corsOptions.origin;
  return regex instanceof RegExp && regex.source !== "(?:)" && regex.test(origin);
};

/**
 * Protects state-changing requests against cross-site request forgery.
 * A request passes with a valid CSRF token (header X-CSRF-Token, as for /nob),
 * or if the browser sent it from ICS itself or from an origin that matches
 * ORIGIN_REGEX, the origins that CORS already trusts. Browsers send the Origin
 * header, or at least the Referer, with such requests, so forged requests from other
 * pages are rejected; requests without both are rejected, too.
 * Requires the csrfProtection middleware, which provides req.isValidCsrfToken().
 */
const requireCsrfTokenOrAllowedOrigin = (req, res, next) => {
  if (SAFE_METHODS.includes(req.method) || req.isValidCsrfToken()) {
    next();
    return;
  }
  const origin = req.get("origin") ?? originOf(req.get("referer"));
  if (!isAllowedOrigin(origin)) {
    logger.warn(`Rejected ${req.method} ${req.baseUrl}: no CSRF token and origin ${origin ?? "unknown"} isn't allowed`);
    res.status(403).json({ error: "invalid_csrf_token" });
    return;
  }
  next();
};

module.exports = {
  requireCsrfTokenOrAllowedOrigin,
};
