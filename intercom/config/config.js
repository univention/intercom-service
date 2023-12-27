/**
 * SPDX-License-Identifier: AGPL-3.0-only
 * SPDX-FileCopyrightText: 2023 Univention GmbH
 */

const issuerBaseURL = process.env.ISSUER_BASE_URL ??
`${process.env.KEYCLOAK_URL}/auth/realms/${process.env.REALM_NAME}`;

const config = {
  corsOptions: {
    methods: "GET,POST,PUT,DELETE,PROPFIND,MKCOL",
    credentials: true,
    // TODO: can we drop Authorization?
    exposedHeaders: [
      "etag",
      "dav",
      "Content-Security-Policy",
      "Location",
      "Authorization",
      "depth",
      "content-type",
      "ocs-apirequest",
    ],
    origin: new RegExp(process.env.ORIGIN_REGEX),
  },
  issuerBaseURL,
};

module.exports = config;
