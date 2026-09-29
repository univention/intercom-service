/**
 * SPDX-License-Identifier: AGPL-3.0-only
 * SPDX-FileCopyrightText: 2024-2026 Univention GmbH
 */

const jose = require("jose");

const {
  verifyJWT,
  JWKS,
  fetchOIDCToken,
  fetchMatrixToken,
  logger,
} = require("../utils");
const { describeError } = require("../utils/errors");
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
        config.name
      );
      next();
      return;
    }
    try {
      await verifyJWT(
        req.appSession[config.session_storage_key],
        issuerBaseUrl,
        JWKS
      );
      logger.debug("%s access_token is valid", config.name);
    } catch (error) {
      if (error.code == "ERR_JWT_EXPIRED" || error.code == "ERR_JWS_INVALID") {
        logger.warn("%s access_token expired, refreshing", config.name);
        logger.warn(`Catched info: ${describeError(error)}`);
        req.appSession[config.session_storage_key] = await fetchOIDCToken(
          req.appSession.access_token,
          config.audience
        );
        logger.info("%s access_token refreshed successfully", config.name);
      }
    } finally {
      next();
    }
  };
};

const MATRIX_TOKEN_EXPIRY_MARGIN_MS = 60 * 1000;

const refreshMatrixTokenIfNeeded = async (req, _, next) => {
  if (!matrix.enabled) {
    logger.debug(
      "%s integration is not enabled, not fetching new token.",
      matrix.name
    );
    next();
    return;
  }

  try {
    const token = req.appSession[matrix.session_storage_key];

    if (
      !token ||
      !token.expiresAt ||
      Date.now() >= token.expiresAt - MATRIX_TOKEN_EXPIRY_MARGIN_MS
    ) {
      logger.debug("%s OpenID token not found or expired, fetching new token.", matrix.name);

      // The same token and claim as at login (afterCallback in app.js): the ID token.
      // It is session data that was verified at login or refresh, so it is only decoded.
      const idToken = jose.decodeJwt(req.appSession.id_token);
      const entryUUID = idToken[userUniqueMapper];
      if (!entryUUID) {
        throw new Error(`The ID token has no "${userUniqueMapper}" claim, check the mappers of the ICS client`);
      }

      req.appSession[matrix.session_storage_key] = await fetchMatrixToken(entryUUID);

      if (req.appSession[matrix.session_storage_key]) {
        logger.info("Fetched new %s OpenID token successfully", matrix.name);
      }
    }
  } catch (error) {
    logger.error("Refreshing %s OpenID token failed: %s", matrix.name, describeError(error));
  } finally {
    next();
  }
};

/**
 * Answers requests for the Nordeck bot with 502 if ICS has no Matrix OpenID
 * token for the user, instead of forwarding them without authentication.
 */
const requireMatrixToken = (req, res, next) => {
  if (matrix.enabled && !req.appSession[matrix.session_storage_key]) {
    logger.warn("No %s OpenID token for the user, not forwarding the request", matrix.name);
    res.status(502).json({ error: "matrix_token_unavailable" });
    return;
  }
  next();
};

module.exports = {
  refreshIntercomTokenIfNeeded,
  refreshOIDCTokenIfNeeded,
  refreshMatrixTokenIfNeeded,
  requireMatrixToken,
};
