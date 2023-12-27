/**
 * SPDX-License-Identifier: AGPL-3.0-only
 * SPDX-FileCopyrightText: 2023 Univention GmbH
 */

const https = require("https");
const axios = require("axios");

const { logger } = require("./logger");

const fetchMatrixToken = async (user_id) => {
  if (!process.env.MATRIX_URL) {
    logger.warning("Matrix integration not configured");
    return;
  }
  const params = {
    // https://spec.matrix.org/v1.4/client-server-api/#appservice-login
    type: "m.login.application_service",
    identifier: {
      type: "m.id.user",
      user: user_id,
    },
  };

  // https://spec.matrix.org/v1.4/application-service-api/#registration
  const headers = {
    Authorization: "Bearer " + process.env.MATRIX_AS_SECRET,
    "Content-Type": "application/json",
  };

  return axios
    .request({
      url: process.env.MATRIX_URL + "/_matrix/client/v3/login",
      headers,
      method: "POST",
      data: params,
      proxy: JSON.parse((process.env.PROXY ?? "false").toLowerCase()),
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
