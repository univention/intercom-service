/**
 * SPDX-License-Identifier: AGPL-3.0-only
 * SPDX-FileCopyrightText: 2024 Univention GmbH
 */

const jose = require("jose");

const verifyJWT = async (token, issuerBaseUrl, jwks) => {
  const { payload, protectedheader } = await jose.jwtVerify(
    // decode and validates claims set
    token,
    jwks,
    {
      issuer: issuerBaseUrl,
    },
  );
  return payload;
};

module.exports = {
  verifyJWT,
};
