/**
 * SPDX-License-Identifier: AGPL-3.0-only
 * SPDX-FileCopyrightText: 2024-2025 Univention GmbH
 */

const express = require("express");
const {
  resumeSilentLogin,
} = require("express-openid-connect/middleware/attemptSilentLogin");
const { logger } = require("../utils");
const router = express.Router();

/**
 * @name /silent
 * @desc
 * Performs a "silent login", eg logs the user into the intercom service without interaction
 * if the user is already logged in to keycloak.
 *
 * Reports the Session Status via window.postmessage (JSON: {"loggedIn": true})
 */
router.get("/", (req, res) => {
  // TODO: Do proper postMessage reporting
  const sessionStatus = "access_token" in req.appSession;
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
