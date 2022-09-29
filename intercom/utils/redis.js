const { auth } = require("express-openid-connect");
const { createClient } = require("redis");
const RedisStore = require("connect-redis")(auth);

const redisClient = createClient({
  legacyMode: true,
  url: `redis://default:${process.env.REDIS_PASSWORD}@redis-intercom:6379`,
});
redisClient.connect().catch(console.error);

const redisStore = new RedisStore({ client: redisClient });

module.exports = { redisClient, redisStore };