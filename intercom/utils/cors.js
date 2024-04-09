/**
 * SPDX-License-Identifier: AGPL-3.0-only
 * SPDX-FileCopyrightText: 2024 Univention GmbH
 */

const massageCors = async (req, proxyRes, allowedRegEx) => {
  const origin = req.get("origin");
  if (origin && origin.match(allowedRegEx)) {
    proxyRes.headers["access-control-allow-origin"] = origin;
  }
};

module.exports = {
  massageCors,
};
