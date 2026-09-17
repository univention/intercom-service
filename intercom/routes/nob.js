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
      stripIntercomCookies(proxyReq);
      if (!req.appSession[matrix.session_storage_key]) {
        logger.info(
          "No Matrix session found in appSession. Likely Matrix is not configured",
        );
        return;
      }
      // Nordeck exchanges the Matrix OpenID token for the user's Matrix ID.
      // https://github.com/nordeck/matrix-meetings/blob/main/matrix-meetings-bot/src/middleware/MatrixAuthMiddleware.ts
      const openIdToken = Buffer.from(
        JSON.stringify(req.appSession[matrix.session_storage_key].openIdToken),
      ).toString("base64url");
      proxyReq.setHeader(
        "authorization",
        `MX-Identity ${openIdToken}`,
      );
    },
    onProxyRes: function (proxyRes, req, res) {
      // TODO: Matrix seems to be specific with it's headers, we have to decide whether to steamroll or to massage...
      massageCors(req, proxyRes, corsOptions.origin);
    },
  }),
);

module.exports = router;
