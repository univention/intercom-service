/**
 * SPDX-License-Identifier: AGPL-3.0-only
 * SPDX-FileCopyrightText: 2026 Univention GmbH
 */

/**
 * Describes an error for the log without its attached data. Errors of axios
 * carry the request configuration, including Authorization headers and the
 * request body with client secrets and tokens, which must never be logged.
 * @param {*} error
 * @returns {string} Message, error code, HTTP status and OAuth error, if any.
 */
const describeError = (error) => {
  if (!(error instanceof Error)) {
    return String(error);
  }
  const details = [];
  if (error.code) {
    details.push(`code ${error.code}`);
  }
  if (error.response?.status) {
    details.push(`status ${error.response.status}`);
  }
  const oauthError = error.response?.data?.error;
  if (typeof oauthError === "string") {
    details.push(`error ${oauthError}`);
  }
  return details.length > 0 ? `${error.message} (${details.join(", ")})` : error.message;
};

module.exports = {
  describeError,
};
