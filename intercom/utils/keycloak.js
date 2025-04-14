/**
 * SPDX-License-Identifier: AGPL-3.0-only
 * SPDX-FileCopyrightText: 2024-2025 Univention GmbH
 */

const axios = require("axios");
const qs = require("qs");
const { logger } = require("./logger");
const { intercom, issuerBaseUrl } = require("../config");

/**
 * Fetches a new OIDC token using Keycloak's Token Exchange functionality.
 *
 * This function exchanges an existing access token for a new one, potentially
 * with a different audience. It uses the "urn:ietf:params:oauth:grant-type:token-exchange"
 * grant type as specified in the Keycloak Token Exchange documentation.
 *
 * @see {@link https://www.keycloak.org/securing-apps/token-exchange} for more details on Keycloak Token Exchange.
 *
 * @param {string} access_token - The existing access token to be exchanged.
 * @param {string} audience - The intended audience for the new token.
 * @returns {Promise<string|undefined>} A promise that resolves to the new access token,
 *                                      or undefined if an error occurs.
 * @throws {Error} If there's an issue with the token exchange request.
 */
const fetchOIDCToken = async (access_token, audience) => {
  var params = {
    grant_type: "urn:ietf:params:oauth:grant-type:token-exchange",
    subject_token: access_token,
    client_id: intercom.clientId,
    client_secret: intercom.clientSecret,
    audience: audience,
  };

  return axios
    .request({
      url: `${issuerBaseUrl}/protocol/openid-connect/token`,
      method: "POST",
      data: qs.stringify(params),
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
      proxy: intercom.proxy,
    })
    .then((res) => {
      return res.data.access_token;
    })
    .catch((err) => {
      logger.error(`Error fetching OIDC token for ${audience}`);
      logger.debug(err);
    });
};

module.exports = {
  fetchOIDCToken,
};
