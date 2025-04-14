/**
 * SPDX-License-Identifier: AGPL-3.0-only
 * SPDX-FileCopyrightText: 2024-2025 Univention GmbH
 */

const { verifyJWT } = require("./jwt");
const { fetchOIDCToken } = require("./keycloak");
const { fetchMatrixToken } = require("./matrix");
const { stripIntercomCookies } = require("./cookies");
const { massageCors } = require("./cors");
const { JWKS } = require("./keys");
const { redisClient, redisStore } = require("./redis");
const { logger } = require("./logger");

module.exports = {
  verifyJWT,
  fetchOIDCToken,
  fetchMatrixToken,
  stripIntercomCookies,
  massageCors,
  JWKS,
  redisClient,
  redisStore,
  logger,
};
