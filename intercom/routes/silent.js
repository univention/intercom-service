/**
 * SPDX-License-Identifier: AGPL-3.0-only
 * SPDX-FileCopyrightText: 2024-2025 Univention GmbH
 */

const express = require("express");
const { attemptSilentLogin } = require("express-openid-connect");
const {
  resumeSilentLogin,
} = require("express-openid-connect/middleware/attemptSilentLogin");
const { logger } = require("../utils");
const { intercom } = require("../config");
const router = express.Router();

// Marks a silent login attempt in progress for a few seconds.
// express-openid-connect keeps one login transaction per browser, so a second
// attempt started meanwhile, from another tab or application, would replace
// the first one's transaction and make its callback fail. The cookie expires
// by itself; an attempt that returns carries eoc's skipSilentLogin cookie and
// is skipped anyway.
const PENDING = "silentLoginPending";
const PENDING_SECONDS = 15;

const attempt = attemptSilentLogin();
const attemptSilentLoginOnce = (req, res, next) => {
  const wouldAttempt =
    !req.cookies.skipSilentLogin &&
    !req.oidc.isAuthenticated() &&
    req.accepts("html");
  if (!wouldAttempt || req.cookies[PENDING]) {
    next();
    return;
  }
  res.cookie(PENDING, "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: intercom.baseUrl?.startsWith("https:"),
    maxAge: PENDING_SECONDS * 1000,
  });
  attempt(req, res, next);
};

/**
 * @name /silent
 * @desc
 * Performs a "silent login", eg logs the user into the intercom service without interaction
 * if the user is already logged in to keycloak. An expiring access token is refreshed first;
 * if keycloak rejects the refresh token, a silent login replaces the session. A load while
 * another silent login is in progress reports the current state instead of trying again.
 *
 * Reports the Session Status via window.postmessage (JSON: {"loggedIn": true}),
 * true while the session holds an access token that hasn't expired
 */
router.get("/", attemptSilentLoginOnce, (req, res) => {
  // TODO: Do proper postMessage reporting
  const accessToken = req.oidc.accessToken;
  const sessionStatus = !!accessToken && !accessToken.isExpired();
  logger.info(`Silent login, logged in ${sessionStatus}`);
  if (!sessionStatus) {
    // `attemptSilentLogin()` sets the `skipSilentLogin` cookie before every attempt and only a
    // successful login clears it, so a failed attempt would suppress every later one for the rest
    // of the browser session - logging out and in again included. The attempt of this request is
    // over when it gets here, so clearing the cookie cannot loop, and the next page load retries.
    resumeSilentLogin(req, res);
  }
  res.render("pages/silent", {
    sessionStatus,
    csrftoken: req.cookies["_csrf_token"],
  });
}
);

module.exports = router;
