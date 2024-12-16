/**
 * SPDX-License-Identifier: AGPL-3.0-only
 * SPDX-FileCopyrightText: 2024 Univention GmbH
 */

const {
  verifyJWT,
  JWKS,
  fetchOIDCToken,
  fetchMatrixToken,
  logger,
} = require("../utils");
const { issuerBaseUrl, userUniqueMapper, matrix } = require("../config");

const refreshIntercomTokenIfNeeded = async (req, _, next) => {
  try {
    let { access_token, isExpired, refresh } = req.oidc.accessToken;
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

const refreshOIDCTokenIfNeeded = (config) => {
  return async (req, _, next) => {
    if (!req.appSession[config.session_storage_key] && !config.enabled) {
      logger.debug(
        "%s access_token not found in session, and integration is not enabled. Not fetching new token.",
        config.name,
      );
      next();
      return;
    }
    try {
      await verifyJWT(
        req.appSession[config.session_storage_key],
        issuerBaseUrl,
        JWKS,
      );
      logger.debug("%s access_token is valid", config.name);
    } catch (error) {
      if (error.code == "ERR_JWT_EXPIRED" || error.code == "ERR_JWS_INVALID") {
        logger.warn("%s access_token expired, refreshing", config.name);
        logger.warn("Catched info:", error);
        req.appSession[config.session_storage_key] = await fetchOIDCToken(
          req.appSession.access_token,
          config.audience,
        );
        logger.info("%s access_token refreshed successfully", config.name);
      }
    } finally {
      next();
    }
  };
};

const refreshMatrixTokenIfNeeded = async (req, _, next) => {
  if (!req.appSession[matrix.session_storage_key] && !matrix.enabled) {
    logger.debug(
      "%s access_token not found in session, and integration is not enabled. Not fetching new token.",
      matrix.name,
    );
    next();
    return;
  }
  try {
    _ = await verifyJWT(
      req.appSession[matrix.session_storage_key],
      issuerBaseUrl,
      JWKS,
    );
    logger.debug("%s access_token is valid", matrix.name);
  } catch (error) {
    if (error.code == "ERR_JWT_EXPIRED" || error.code == "ERR_JWS_INVALID") {
      logger.warn(
        "%s access_token expired or invalid, refreshing",
        matrix.name,
      );
      logger.warn("Catched info:", error);
      let entryUUID = req.decodedAccessToken[userUniqueMapper];
      req.appSession[matrix.session_storage_key] =
        await fetchMatrixToken(entryUUID);
      logger.info("Refreshed successfully");
    }
  } finally {
    next();
  }
};

module.exports = {
  refreshIntercomTokenIfNeeded,
  refreshOIDCTokenIfNeeded,
  refreshMatrixTokenIfNeeded,
};
