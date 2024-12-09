/**
 * SPDX-License-Identifier: AGPL-3.0-only
 * SPDX-FileCopyrightText: 2024 Univention GmbH
 */

const express = require("express");
const router = express.Router();

const { createProxyMiddleware } = require("http-proxy-middleware");

const { stripIntercomCookies, massageCors } = require("../utils");
const { corsOptions, logLevel, xwiki } = require("../config");

/**
 * @name /wiki/
 * @desc
 * Proxy for XWiki.
 * Adds the proper Authorization Header
 * @example GET http://ics.domain.test/wiki/bin/get/Blog/BlogRss?xpage=plain&blog=some.Newsfeed.WebHome
 */
router.use(
  "/",
  createProxyMiddleware({
    target: xwiki.url,
    logLevel,
    changeOrigin: true,
    pathRewrite: {
      "^/wiki": "",
    },
    onProxyReq: function onProxyReq(proxyReq, req, res) {
      stripIntercomCookies(proxyReq);
      proxyReq.setHeader(
        "authorization",
        `Bearer ${req.appSession[xwiki.session_storage_key]}`,
      );
    },
    onProxyRes: function (proxyRes, req, res) {
      massageCors(req, proxyRes, corsOptions.origin);
    },
  }),
);

module.exports = router;
