/**
 * SPDX-License-Identifier: AGPL-3.0-only
 * SPDX-FileCopyrightText: 2024-2026 Univention GmbH
 */

const { auth } = require("express-openid-connect");
const { createClient } = require("redis");
const RedisStore = require("connect-redis")(auth);
const fs = require('fs');

const { logger } = require("./logger");
const { describeError } = require("./errors");
const { redis } = require("../config");

let redisClient;
// A custom CA for Redis is provided through NODE_EXTRA_CA_CERTS (Helm chart:
// ics.redis.ssl.customca, App Center: root-ca-pem), which Node.js trusts for all
// TLS connections. The server certificate is always verified.
let tlsOptions = {
    rejectUnauthorized: true,
};

if ( redis.mTLS ){
    const clientCert = fs.readFileSync("/app/client-cert.pem");  // Load client certificate
    const clientKey = fs.readFileSync("/app/client-key.pem");  // Load client key

    tlsOptions.cert = clientCert;
    tlsOptions.key = clientKey;
}

// The credentials are passed as options, not in the URL, so that they may contain any character.
const credentials = redis.password ? { username: redis.user, password: redis.password } : {};

if ( redis.SSL ){
    redisClient = createClient({
      legacyMode: true,
      url: `rediss://${redis.host}:${redis.port}`,
      ...credentials,
      socket: {
        tls: true,
        ...(redis.servername ? { servername: redis.servername } : {}),
        ...tlsOptions,
      },
    });
} else {
    redisClient = createClient({
      legacyMode: true,
      url: `redis://${redis.host}:${redis.port}`,
      ...credentials,
    });
}

redisClient.on("error", (err) => {
    logger.error(`Redis error: ${describeError(err)}`);
  });
redisClient.on("connect", () => {
    logger.info("Redis connected");
  });
redisClient.on("reconnecting", () => {
    logger.info("Redis reconnecting");
  });

redisClient.connect().catch((err) => logger.error(`Redis connection failed: ${describeError(err)}`));

const redisStore = new RedisStore({ client: redisClient });

module.exports = { redisClient, redisStore };
