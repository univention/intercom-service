/**
 * SPDX-License-Identifier: AGPL-3.0-only
 * SPDX-FileCopyrightText: 2024 Univention GmbH
 */

const axios = require("axios");
const qs = require("qs");
const { logger } = require("./logger");

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
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    audience: audience,
  };

  return axios
    .request({
      url:
        (process.env.ISSUER_BASE_URL ??
          `${process.env.KEYCLOAK_URL}/auth/realms/${process.env.REALM_NAME}`) +
        "/protocol/openid-connect/token",
      method: "POST",
      data: qs.stringify(params),
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
      proxy: JSON.parse((process.env.PROXY ?? "false").toLowerCase()),
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
