/**
 * SPDX-License-Identifier: AGPL-3.0-only
 * SPDX-FileCopyrightText: 2024 Univention GmbH
 */

const { verifyJWT, JWKS, logger } = require("../utils");
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
      logger.warn("Error verifying ICS OIDC access_token");
      logger.debug(error);
      logger.info("Handling the error above: attempting silent login to replace expired token");
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
      logger.warn("Error verifying ICS OIDC id_token");
      logger.debug(error);
      logger.info("Handling the error above: attempting silent login to replace expired token");
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
