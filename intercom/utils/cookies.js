/**
 * SPDX-License-Identifier: AGPL-3.0-only
 * SPDX-FileCopyrightText: 2024-2026 Univention GmbH
 */

const cookie = require("cookie");

const { logger } = require("./logger");

// Cookies that belong to ICS itself and must never reach a backend: the CSRF
// token and the helper cookies of express-openid-connect's login flow
// (including the legacy fallback of the SameSite=None transient cookie).
const INTERCOM_COOKIES = ["_csrf_token", "skipSilentLogin", "auth_verification", "_auth_verification"];

// The session cookie (express-openid-connect's default session.name, which app.js keeps);
// large values are split into appSession.0, appSession.1, ...
const isSessionCookie = (name) => name === "appSession" || name.startsWith("appSession.");

const isIntercomCookie = (name) => isSessionCookie(name) || INTERCOM_COOKIES.includes(name);

const stripIntercomCookies = (proxyReq) => {
  const header = proxyReq.getHeader("cookie");
  if (header === undefined) {
    return;
  }
  try {
    const cookies = cookie.parse(header);
    const keep = Object.keys(cookies)
      .filter((name) => !isIntercomCookie(name))
      .map((name) => cookie.serialize(name, cookies[name]));
    if (keep.length > 0) {
      proxyReq.setHeader("cookie", keep.join("; "));
    } else {
      proxyReq.removeHeader("cookie");
    }
  } catch (error) {
    logger.warn(`Not forwarding any cookies, the Cookie header can't be processed: ${error.message}`);
    proxyReq.removeHeader("cookie");
  }
};

module.exports = {
  stripIntercomCookies,
};
