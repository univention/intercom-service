/**
 * SPDX-License-Identifier: AGPL-3.0-only
 * SPDX-FileCopyrightText: 2024-2026 Univention GmbH
 */

const https = require("https");
const axios = require("axios");

const { logger } = require("./logger");
const { matrix, intercom } = require("../config");

const fetchMatrixToken = async (user_id) => {
  if (!matrix.url) {
    logger.warn("Matrix integration not configured");
    return;
  }

  const mxId = `@${user_id.toLowerCase()}:${matrix.serverName}`;
  // The AS token is used with identity assertion instead of logging in as the
  // user. MAS no longer supports m.login.application_service.
  const headers = {
    Authorization: "Bearer " + matrix.appServiceSecret,
    "Content-Type": "application/json",
  };

  return axios
    .request({
      // https://spec.matrix.org/v1.17/client-server-api/#openid
      url: `${matrix.url}/_matrix/client/v3/user/${encodeURIComponent(mxId)}/openid/request_token`,
      headers,
      method: "POST",
      params: { user_id: mxId },
      data: {},
      proxy: intercom.proxy,
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    })
    .then((res) => ({
      openIdToken: res.data,
      expiresAt: Date.now() + res.data.expires_in * 1000,
    }))
    .catch((err) => {
      logger.error("Error fetching Matrix token");
      logger.debug(err);
    });
};

module.exports = {
  fetchMatrixToken,
};
