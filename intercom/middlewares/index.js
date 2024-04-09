/**
 * SPDX-License-Identifier: AGPL-3.0-only
 * SPDX-FileCopyrightText: 2024 Univention GmbH
 */

const { oidcVerifyDecodeAccessToken, oidcVerifyDecodeIdentityToken } = require("./jwt");
const { refreshTokenIfNeeded, refreshNextcloudTokenIfNeeded } = require("./tokenRenewal");
const { updateSessionState } = require("./sessionState");

module.exports = {
  oidcVerifyDecodeAccessToken,
  oidcVerifyDecodeIdentityToken,
  refreshTokenIfNeeded,
  refreshNextcloudTokenIfNeeded,
  updateSessionState,
};
