const { createClient } = require("redis");

let redisClient = createClient({
  legacyMode: true,
  url: `redis://default:${process.env.REDIS_PASSWORD}@redis-intercom:6379`,
});
redisClient.connect().catch(console.error);

module.exports = { redisClient };