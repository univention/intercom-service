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