/**
 * SPDX-License-Identifier: AGPL-3.0-only
 * SPDX-FileCopyrightText: 2024 Univention GmbH
 */

const cookie = require("cookie");

const stripIntercomCookies = async (proxyReq) => {
  const cookies = cookie.parse(proxyReq.getHeader("cookie"));
  delete cookies["appSession"];
  if (Object.keys(cookies).length > 0) {
    const keep = Object.keys(cookies).map((c) =>
      cookie.serialize(c, cookies[c])
    );
    proxyReq.setHeader("cookie", keep.join("; "));
  }
};

module.exports = {
  stripIntercomCookies,
};
