/**
 * SPDX-License-Identifier: AGPL-3.0-only
 * SPDX-FileCopyrightText: 2026 Univention GmbH
 */

/**
 * Sets basic security headers on all responses. Proxied responses keep the
 * values of the backend if it sends them. There's no X-Frame-Options: other
 * apps embed /silent, which restricts framing itself.
 */
const securityHeaders = (req, res, next) => {
  res.set("X-Content-Type-Options", "nosniff");
  res.set("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
};

module.exports = {
  securityHeaders,
};
