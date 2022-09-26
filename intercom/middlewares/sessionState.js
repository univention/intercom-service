const { redisClient } = require("../utils");

const updateSessionState = (req, res, next) => {
  if (
    req.cookies &&
      "appSession" in req.cookies &&
      req.appSession &&
      "session_state" in req.appSession
  ) {
    redisClient.set(req.appSession["session_state"], req.cookies["appSession"]);
  }
  next();
};

module.exports = {
  updateSessionState,
};