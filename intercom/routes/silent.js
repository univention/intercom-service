const express = require("express");
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
  res.render("pages/silent", {
    sessionStatus,
    csrftoken: req.cookies["_csrf_token"],
  });
}
);

module.exports = router;