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
    logger.warning("Matrix integration not configured");
    return;
  }
  const params = {
    // https://spec.matrix.org/v1.17/client-server-api/#appservice-login
    type: "m.login.application_service",
    identifier: {
      type: "m.id.user",
      // https://spec.matrix.org/v1.17/appendices/#user-identifiers
      user: user_id.toLowerCase(),
    },
  };

  // https://spec.matrix.org/v1.4/application-service-api/#registration
  const headers = {
    Authorization: "Bearer " + matrix.appServiceSecret,
    "Content-Type": "application/json",
  };

  return axios
    .request({
      url: `${matrix.url}/_matrix/client/v3/login`,
      headers,
      method: "POST",
      data: params,
      proxy: intercom.proxy,
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    })
    .then((res) => {
      return res.data.access_token;
    })
    .catch((err) => {
      logger.error("Error fetching Matrix token");
      logger.debug(err);
    });
};

module.exports = {
  fetchMatrixToken,
};
