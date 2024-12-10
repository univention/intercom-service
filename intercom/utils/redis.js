/**
 * SPDX-License-Identifier: AGPL-3.0-only
 * SPDX-FileCopyrightText: 2024 Univention GmbH
 */

const { auth } = require("express-openid-connect");
const { createClient } = require("redis");
const RedisStore = require("connect-redis")(auth);
const fs = require('fs');

const { logger } = require("./logger");
const { redis } = require("../config");

const customCA = redis.caPath !== "...";
let redisClient;
let tlsOptions = {
    rejectUnauthorized: true,
};

if ( redis.customCA ){
    const caCert = fs.readFileSync(redis.caPath);  // Load the custom CA

    tlsOptions.ca = [caCert];
    tlsOptions.rejectUnauthorized = false;
}

if ( redis.mTLS ){
    const clientCert = fs.readFileSync("/app/client-cert.pem");  // Load client certificate
    const clientKey = fs.readFileSync("/app/client-key.pem");  // Load client key

    tlsOptions.cert = clientCert;
    tlsOptions.key = clientKey;
}

if ( redis.SSL ){
    redisClient = createClient({
      legacyMode: true,
      url: `rediss://${redis.user}:${redis.password}@${redis.host}:${redis.port}`,
      socket: {
        tls: true,
        ...tlsOptions,
      },
    });
} else {
    redisClient = createClient({
      legacyMode: true,
      url: `redis://${redis.user}:${redis.password}@${redis.host}:${redis.port}`,
    });
}

redisClient.on("error", (err) => {
    logger.error("Redis error: ", err);
  });
redisClient.on("connect", () => {
    logger.info("Redis connected");
  });
redisClient.on("reconnecting", () => {
    logger.info("Redis reconnecting");
  });

redisClient.connect().catch(logger.error);

const redisStore = new RedisStore({ client: redisClient });

module.exports = { redisClient, redisStore };
