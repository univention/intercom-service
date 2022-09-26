const refreshTokenIfNeeded = async (req, res, next) => {
  try {
    let { token_type, access_token, isExpired, refresh } = req.oidc.accessToken;
    if (isExpired()) {
      ({ access_token } = await refresh());
      req.appSession.access_token = access_token;
      console.log("Refreshing expired token");
    }
  } catch (err) {
    console.error("Refreshing expired token failed", err);
  }
  next();
};

module.exports = {
  refreshTokenIfNeeded,
};