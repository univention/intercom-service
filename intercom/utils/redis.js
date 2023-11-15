const { auth } = require("express-openid-connect");
const { createClient } = require("redis");
const RedisStore = require("connect-redis")(auth);

const { logger } = require("./logger");

const redisClient = createClient({
  legacyMode: true,
  url: `redis://default:${process.env.REDIS_PASSWORD}@${
    process.env.REDIS_HOST ?? "redis-intercom"
  }:6379`,
})
  .on("error", (err) => {
    logger.error("Redis error: ", err);
  })
  .on("connect", () => {
    logger.info("Redis connected");
  })
  .on("reconnecting", () => {
    logger.info("Redis reconnecting");
  });

redisClient.connect().catch(logger.error);

const redisStore = new RedisStore({ client: redisClient });

module.exports = { redisClient, redisStore };
