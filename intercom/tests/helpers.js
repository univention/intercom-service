/**
 * SPDX-License-Identifier: AGPL-3.0-only
 * SPDX-FileCopyrightText: 2026 Univention GmbH
 */

/* eslint-env node */

/*
 * Helpers shared by the unit tests (run with `yarnpkg test`, which uses the
 * built-in Node.js test runner).
 */
const path = require("node:path");

/**
 * Replaces a module of the service with a fake before anything requires it.
 * @param {string} relativePath - Path relative to the intercom directory, e.g. "utils/redis.js".
 * @param {object} exports - What `require()` should return for the module.
 */
const stubModule = (relativePath, exports) => {
  const filename = path.join(__dirname, "..", relativePath);
  require.cache[filename] = { id: filename, filename, loaded: true, exports };
  return exports;
};

/**
 * Replaces utils/redis.js, which connects to Redis as soon as it is loaded,
 * with an in-memory client that supports both callbacks and promises.
 */
const stubRedis = () => {
  const store = new Map();
  const reply = (args, value) => {
    const callback = args.find((arg) => typeof arg === "function");
    if (callback) {
      callback(null, value);
    }
    return Promise.resolve(value);
  };
  const redisClient = {
    store,
    calls: [],
    get: (key, ...args) => reply(args, store.has(key) ? store.get(key).value : null),
    set: (key, value, ...args) => {
      redisClient.calls.push(["set", key, value, ...args.filter((a) => typeof a !== "function")]);
      store.set(key, { value, options: args.filter((a) => typeof a !== "function") });
      return reply(args, "OK");
    },
    del: (key, ...args) => {
      redisClient.calls.push(["del", key]);
      return reply(args, store.delete(key) ? 1 : 0);
    },
  };
  stubModule("utils/redis.js", { redisClient, redisStore: {} });
  return redisClient;
};

/**
 * Starts an Express app (or any request listener) on a random local port.
 * @returns {Promise<{url: string, close: function}>}
 */
const listen = (app) =>
  new Promise((resolve) => {
    const server = app.listen(0, "127.0.0.1", () => {
      resolve({
        url: `http://127.0.0.1:${server.address().port}`,
        server,
        close: () => new Promise((done) => server.close(done)),
      });
    });
  });

module.exports = {
  stubModule,
  stubRedis,
  listen,
};
