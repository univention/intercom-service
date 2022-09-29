const { redisClient } = require("../utils");

const updateSessionState = async (req, res, next) => {
  if (
    req.cookies &&
      "appSession" in req.cookies &&
      req.appSession &&
      "session_state" in req.appSession
  ) {
    await redisClient.set(req.appSession["session_state"], req.cookies["appSession"]);
  }
  next();
};


module.exports = {
  updateSessionState,
};