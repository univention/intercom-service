/**
 * SPDX-License-Identifier: AGPL-3.0-only
 * SPDX-FileCopyrightText: 2024-2026 Univention GmbH
 */

const {
  oidcVerifyDecodeAccessToken,
  oidcVerifyDecodeIdentityToken,
} = require("./jwt");
const {
  refreshIntercomTokenIfNeeded,
  refreshOIDCTokenIfNeeded,
  refreshMatrixTokenIfNeeded,
  requireMatrixToken,
} = require("./tokenRenewal");
const { updateSessionState } = require("./sessionState");

module.exports = {
  oidcVerifyDecodeAccessToken,
  oidcVerifyDecodeIdentityToken,
  refreshIntercomTokenIfNeeded,
  refreshOIDCTokenIfNeeded,
  refreshMatrixTokenIfNeeded,
  requireMatrixToken,
  updateSessionState,
};
