const jose = require("jose");
const path = require("node:path");
const { issuerBaseURL } = require("../config");

const JWKS = jose.createRemoteJWKSet(
  new URL(
    path
      .join(issuerBaseURL, "/protocol/openid-connect/certs")
      .replace(/\\/g, "/")
      .replace(":/", "://")
  )
);

module.exports = { JWKS };