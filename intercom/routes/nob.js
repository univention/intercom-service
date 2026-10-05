/**
 * SPDX-License-Identifier: AGPL-3.0-only
 * SPDX-FileCopyrightText: 2024-2025 Univention GmbH
 */

const express = require("express");
const router = express.Router();

const { createProxyMiddleware } = require("http-proxy-middleware");

const { stripIntercomCookies, massageCors, logger } = require("../utils");
const { corsOptions, logLevel, nordeck, matrix } = require("../config");

/**
 * @name /nob/
 * @desc
 * Proxy for the Nordeck Bot (or just the plain Matrix UserInfo Service in testing).
 * Adds the proper Authorization Header
 */
router.use(
  "/",
  createProxyMiddleware({
    target: nordeck.url,
    logLevel,
    logger,
    changeOrigin: true,
    pathRewrite: { "^/nob": "" },
    secure: false,
    onProxyReq: function onProxyReq(proxyReq, req, res) {
      // This runs inside http-proxy's `proxyReq` event, which is not an Express
      // handler: anything thrown here escapes as an uncaught exception and takes the
      // whole process down. So it must never throw - on any problem it logs and
      // forwards the request without the header rather than letting it propagate.
      try {
        stripIntercomCookies(proxyReq);
        const matrixSession = req.appSession[matrix.session_storage_key];
        // The OpenID token is missing when Matrix is not configured, when its fetch
        // failed, or when the session still holds the pre-MAS token shape (a plain
        // string, before the OpenID token object). In every case there is nothing to
        // assert as the user's identity, so proceed without the header.
        if (!matrixSession || !matrixSession.openIdToken) {
          logger.info(
            "No Matrix OpenID token in appSession, forwarding /nob request without the MX-Identity header.",
          );
          return;
        }
        // Nordeck exchanges the Matrix OpenID token for the user's Matrix ID.
        // https://github.com/nordeck/matrix-meetings/blob/main/matrix-meetings-bot/src/middleware/MatrixAuthMiddleware.ts
        const openIdToken = Buffer.from(
          JSON.stringify(matrixSession.openIdToken),
        ).toString("base64url");
        proxyReq.setHeader("authorization", `MX-Identity ${openIdToken}`);
      } catch (error) {
        logger.error("Error setting the MX-Identity header for /nob");
        logger.debug(error);
      }
    },
    onProxyRes: function (proxyRes, req, res) {
      // TODO: Matrix seems to be specific with it's headers, we have to decide whether to steamroll or to massage...
      massageCors(req, proxyRes, corsOptions.origin);
    },
  }),
);

module.exports = router;
