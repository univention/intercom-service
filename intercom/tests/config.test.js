/**
 * SPDX-License-Identifier: AGPL-3.0-only
 * SPDX-FileCopyrightText: 2026 Univention GmbH
 */

/* eslint-env node */

const { test, afterEach } = require("node:test");
const assert = require("node:assert");

const CONFIG = require.resolve("../config/config");
const ORIGINAL_ENV = { ...process.env };

/**
 * Load the configuration again with the given environment.
 * @param {Object<string, string>} env Environment variables to set.
 * @returns {Object} The new configuration.
 */
const loadConfig = (env) => {
  Object.assign(process.env, env);
  delete require.cache[CONFIG];
  return require(CONFIG);
};

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
  delete require.cache[CONFIG];
});

test("uses ISSUER_BASE_URL when it is set", () => {
  const config = loadConfig({
    ISSUER_BASE_URL: "https://id.example.test/realms/custom",
    KEYCLOAK_URL: "https://id.example.test",
    REALM_NAME: "nubus",
  });

  assert.strictEqual(config.issuerBaseUrl, "https://id.example.test/realms/custom");
});

test("builds the issuer from Keycloak URL and realm when ISSUER_BASE_URL is empty", () => {
  const config = loadConfig({
    ISSUER_BASE_URL: "",
    KEYCLOAK_URL: "https://id.example.test",
    REALM_NAME: "nubus",
  });

  assert.strictEqual(config.issuerBaseUrl, "https://id.example.test/realms/nubus");
});

test("builds the issuer from Keycloak URL and realm when ISSUER_BASE_URL is unset", () => {
  delete process.env.ISSUER_BASE_URL;
  const config = loadConfig({
    KEYCLOAK_URL: "https://id.example.test",
    REALM_NAME: "nubus",
  });

  assert.strictEqual(config.issuerBaseUrl, "https://id.example.test/realms/nubus");
});
