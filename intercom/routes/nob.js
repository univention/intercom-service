const express = require("express");
const router = express.Router();

const { createProxyMiddleware } = require("http-proxy-middleware");

const { stripIntercomCookies, massageCors } = require("../utils");
const { corsOptions } = require("../config");

/**
 * @name /nob/
 * @desc
 * Proxy for the Nordeck Bot (or just the plain Matrix UserInfo Service in testing).
 * Adds the proper Authorization Header
 */
router.use("/nob", createProxyMiddleware({
  target: process.env.NORDECK_URL,
  logLevel: "info",
  changeOrigin: true,
  pathRewrite: { "^/nob": "" },
  secure: false,
  onProxyReq: function onProxyReq(proxyReq, req, res) {
    stripIntercomCookies(proxyReq);
    // TODO: Build Switch for Nordeck Live Mode
    // Example headers.set('authorization', `MX-Identity ${btoa(JSON.stringify(t))}`);
    // or  proxyReq.setHeader('authorization', `Bearer ${matrix_access_token}`);
  
    if (req.appSession.matrix_access_token) {
      proxyReq.setHeader(
        "authorization",
        `Bearer ${req.appSession.matrix_access_token}`
      );
    }
  },
  onProxyRes: function (proxyRes, req, res) {
    // TODO: Matrix seems to be specific with it's headers, we have to decide whether to steamroll or to massage...
    massageCors(req, proxyRes, corsOptions.origin);
  },
})
);

module.exports = router;