const { verifyJWT } = require("./jwt");
const { fetchOIDCToken } = require("./keycloak");
const { fetchMatrixToken } = require("./matrix");
const { stripIntercomCookies } = require("./cookies");
const { massageCors } = require("./cors");
const { JWKS } = require("./keys");
const { redisClient, redisStore } = require("./redis");

module.exports = {
  verifyJWT,
  fetchOIDCToken,
  fetchMatrixToken,
  stripIntercomCookies,
  massageCors,
  JWKS,
  redisClient,
  redisStore,
};