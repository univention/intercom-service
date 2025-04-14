/**
 * SPDX-License-Identifier: AGPL-3.0-only
 * SPDX-FileCopyrightText: 2024-2025 Univention GmbH
 */

const jose = require("jose");
const path = require("node:path");
const { issuerBaseUrl } = require("../config");

const JWKS = jose.createRemoteJWKSet(
  new URL(
    path
      .join(issuerBaseUrl, "/protocol/openid-connect/certs")
      .replace(/\\/g, "/")
      .replace(":/", "://"),
  ),
);

module.exports = { JWKS };
