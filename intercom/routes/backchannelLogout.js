const express = require("express");
const router = express.Router();

const jose = require("jose");

const { issuerBaseURL } = require("../config");
const { JWKS, redisClient } = require("../utils");

/**
 * @name /backchannel-logout
 * @desc
 * OpenID Connect Backchannel Logout implementation to delete the session from the store
 */
router.post("/", async (req, res) => {
  const { payload, protectedHeader } = await jose.jwtVerify(  // decode and validates claims set
    req.body.logout_token,
    JWKS,
    {
      issuer: issuerBaseURL,
      // maxTokenAge: "10 seconds"  // to avoid replay attack too far after issued_at
    }
  );
  redisClient.get( payload["sid"], function(err, session_id) {
    redisClient.del("sess:" + session_id);
    redisClient.del(payload["sid"]);
    res.send("Done");
  });
  /*
    * redisClient.destroy(payload.sid, (err) => {
    *   console.error("Could not destroy session", err);
    * });
  */
});

module.exports = router;