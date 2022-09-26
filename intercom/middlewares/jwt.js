const { verifyJWT, JWKS } = require("../utils");
const { issuerBaseURL } = require("../config");

const oidcVerifyDecodeAccessToken = async (req, res, next) => {
  try {
    req.decodedAccessToken = await verifyJWT(
      req.appSession.access_token,
      issuerBaseURL,
      JWKS
    );
    next();
  } catch (error) {
    console.error("Error verifying OIDC Access Token", error);
    res.status(401).send();
  }
};
  
const oidcVerifyDecodeIdentityToken = async (req, res, next) => {
  try {
    req.decodedIdToken = await verifyJWT(
      req.appSession.id_token,
      issuerBaseURL,
      JWKS
    );
    next();
  } catch (error) {
    console.error("Error verifying OIDC Identity Token", error);
    res.status(401).send();
  }
};

module.exports = {
  oidcVerifyDecodeAccessToken,
  oidcVerifyDecodeIdentityToken
};