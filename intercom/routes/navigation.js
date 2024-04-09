/**
 * SPDX-License-Identifier: AGPL-3.0-only
 * SPDX-FileCopyrightText: 2024 Univention GmbH
 */

const express = require("express");
const router = express.Router();

const { createProxyMiddleware } = require("http-proxy-middleware");

const { stripIntercomCookies, massageCors } = require("../utils");
const { corsOptions } = require("../config");

/**
 * @name "/portal.json (without silly quotes for jsdoc)"
 * @desc
 * Proxy to the portal for global Navigation Data.
 * Adds the proper Authorization Header
 */
// TODO: https://127.0.0.1/univention/portal/navigation.json?lang=de_DE -H "Authorization: Basic username:MyPortalSecretFromBMIUXAnsibleHostINI"
router.use("/", createProxyMiddleware({
  target: process.env.PORTAL_URL,
  logLevel: `${process.env.LOG_LEVEL}`.toLowerCase() ?? "info",
  changeOrigin: true,
  pathRewrite: { "^/navigation.json": "/univention/portal/navigation.json" },
  onProxyReq: function onProxyReq(proxyReq, req, res) {
    stripIntercomCookies(proxyReq);
    proxyReq.setHeader(
      "Authorization",
      "Basic " +
            btoa(
              req.decodedIdToken["phoenixusername"] +
                ":" +
                process.env.PORTAL_API_KEY
            )
    );
  },
  onProxyRes: function (proxyRes, req, res) {
    massageCors(req, proxyRes, corsOptions.origin);
  },
})
);

module.exports = router;
