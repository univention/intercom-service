/**
 * SPDX-License-Identifier: AGPL-3.0-only
 * SPDX-FileCopyrightText: 2024-2025 Univention GmbH
 */

const { verifyJWT, JWKS, logger } = require("../utils");
const { issuerBaseUrl } = require("../config");

// These middlewares guard the API routes, which clients call with XHR from
// other origins: a redirect to the IdP can't work there, so they answer 401,
// as requiresAuth() does for requests without a session.

// Verifies the session's token `name` and stores its payload as req[key].
const oidcVerifyDecode = (name, key) => async (req, res, next) => {
  try {
    req[key] = await verifyJWT(req.appSession?.[name], issuerBaseUrl, JWKS);
  } catch (error) {
    logger.warn("Error verifying ICS OIDC %s", name);
    logger.debug(error);
    res.status(401).send();
    return;
  }
  next();
};

const oidcVerifyDecodeAccessToken = oidcVerifyDecode(
  "access_token",
  "decodedAccessToken",
);
const oidcVerifyDecodeIdentityToken = oidcVerifyDecode(
  "id_token",
  "decodedIdToken",
);

module.exports = {
  oidcVerifyDecodeAccessToken,
  oidcVerifyDecodeIdentityToken,
};
