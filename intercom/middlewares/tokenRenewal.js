/**
 * SPDX-License-Identifier: AGPL-3.0-only
 * SPDX-FileCopyrightText: 2024 Univention GmbH
 */

const { verifyJWT, JWKS, fetchOIDCToken, fetchMatrixToken, logger } = require("../utils");
const { issuerBaseURL } = require("../config");

const refreshTokenIfNeeded = async (req, _, next) => {
  try {
    let { token_type, access_token, isExpired, refresh } = req.oidc.accessToken;
    if (isExpired()) {
      ({ access_token } = await refresh());
      req.appSession.access_token = access_token;
      logger.debug("Refreshing ICS expired access_token");
    }
  } catch (err) {
    logger.error("Refreshing ICS expired access_token failed");
  } finally {
    next();
  }
};

const refreshNextcloudTokenIfNeeded = async (req, _, next) => {
  try {
    _ = await verifyJWT(
      req.appSession.nc_access_token,
      issuerBaseURL,
      JWKS
    );
    logger.debug("Nextcloud access_token is valid");
  } catch (error) {
    if (error.code == "ERR_JWT_EXPIRED" || error.code == "ERR_JWS_INVALID") {
      logger.warn("Nextcloud access_token expired or invalid, refreshing");
      logger.warn("Catched info:", error);
      req.appSession.nc_access_token = await fetchOIDCToken(
        req.appSession.access_token,
        `${process.env.NC_AUDIENCE}`
      );
      logger.info("Refreshed successfully");
    }
  } finally {
    next();
  }
};

const refreshMatrixTokenIfNeeded = async (req, _, next) => {
  try {
    _ = await verifyJWT(
      req.appSession.matrix_access_token,
      issuerBaseURL,
      JWKS
    );
    logger.debug("Matrix access_token is valid");
  } catch (error) {
    if (error.code == "ERR_JWT_EXPIRED" || error.code == "ERR_JWS_INVALID") {
      logger.warn("Matrix access_token expired or invalid, refreshing");
      logger.warn("Catched info:", error);
      let entryUUID = req.decodedAccessToken[process.env.USER_UNIQUE_MAPPER ?? "entryuuid"];
      req.appSession.matrix_access_token = await fetchMatrixToken(entryUUID);
      logger.info("Refreshed successfully");
    }
  } finally {
    next();
  }
};

module.exports = {
  refreshTokenIfNeeded,
  refreshNextcloudTokenIfNeeded,
  refreshMatrixTokenIfNeeded
};
