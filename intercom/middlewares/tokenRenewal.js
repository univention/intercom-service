const { verifyJWT, JWKS, fetchOIDCToken } = require("../utils");
const { issuerBaseURL } = require("../config");


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

const refreshNextcloudTokenIfNeeded = async (req, res, next) => {
  try {
    const nc_access_token = await verifyJWT(
      req.appSession.nc_access_token,
      issuerBaseURL,
      JWKS
    );
    console.log("NC Access Token is valid", nc_access_token);
  } catch (error) {
    if (error.code == "ERR_JWT_EXPIRED") {
      console.warn("NC Access Token expired, refreshing", error);
      req.appSession.nc_access_token = await fetchOIDCToken(
        req.appSession.access_token,
        `${process.env.NC_AUDIENCE}`
      );
      console.log(req.appSession.nc_access_token);
    } 
  } finally {
    next();
  }
};


module.exports = {
  refreshTokenIfNeeded,
  refreshNextcloudTokenIfNeeded,
};