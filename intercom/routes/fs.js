const express = require("express");
const router = express.Router();

const { createProxyMiddleware } = require("http-proxy-middleware");

const { stripIntercomCookies, massageCors } = require("../utils");
const { corsOptions } = require("../config");

/**
 * @name /fs/
 * @desc
 * Proxy for Nextcloud.
 * Adds the proper Authorization Header
 * @example PROPFIND http://ic.p.test/fs/remote.php/dav/files/usera1/Photos
 *
 */
router.use("/", createProxyMiddleware({
  target: process.env.NC_URL,
  logLevel: "info",
  changeOrigin: true,
  pathRewrite: {
    "^/fs": "",
  },
  onProxyReq: function onProxyReq(proxyReq, req, res) {
    // TODO: Service takes pretty much any token which is not good
    stripIntercomCookies(proxyReq);
    proxyReq.setHeader(
      "authorization",
      `Bearer ${req.appSession.ox_access_token}`
    );
  },
  onProxyRes: function (proxyRes, req, res) {
    massageCors(req, proxyRes, corsOptions.origin);
  },
})
);

module.exports = router;