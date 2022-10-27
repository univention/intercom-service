const { verifyJWT, JWKS } = require("../utils");
const { issuerBaseURL } = require("../config");

const oidcVerifyDecodeAccessToken = (callback) => {
  return  async (req, res, next) => {
    try {
      req.decodedAccessToken = await verifyJWT(
        req.appSession.access_token,
        issuerBaseURL,
        JWKS
      );
    } catch (error) {
      console.warn("Error verifying OIDC Access Token", error);
      console.info("Handling the error above: attempting silent login to replace expired token");
      // res.redirect(302, "/silent");
      callback(req, res, next);
    } finally {
      next();
    }
  };
};
  
const oidcVerifyDecodeIdentityToken = (callback) => {
  return async (req, res, next) => {
    try {
      req.decodedIdToken = await verifyJWT(
        req.appSession.id_token,
        issuerBaseURL,
        JWKS
      );
    } catch (error) {
      console.warn("Error verifying OIDC Access Token", error);
      console.info("Handling the error above: attempting silent login to replace expired token");
      // res.redirect(302, "/silent");
      callback(req, res, next);
    } finally {
      next();
    }
  };
};

module.exports = {
  oidcVerifyDecodeAccessToken,
  oidcVerifyDecodeIdentityToken
};