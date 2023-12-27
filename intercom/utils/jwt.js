/**
 * SPDX-License-Identifier: AGPL-3.0-only
 * SPDX-FileCopyrightText: 2023 Univention GmbH
 */

const jose = require("jose");

const verifyJWT = async (token, issuerBaseURL, jwks) => {
  const { payload, protectedheader } = await jose.jwtVerify(
    // decode and validates claims set
    token,
    jwks,
    {
      issuer: issuerBaseURL,
    }
  );
  return payload;
};

module.exports = {
  verifyJWT,
};
