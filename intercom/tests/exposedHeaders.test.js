/**
 * SPDX-License-Identifier: AGPL-3.0-only
 * SPDX-FileCopyrightText: 2026 Univention GmbH
 */

/* eslint-env node */

const { test } = require("node:test");
const assert = require("node:assert");
const express = require("express");
const cors = require("cors");

const { listen } = require("./helpers");

process.env.ISSUER_BASE_URL = "https://id.example.test/realms/test";
process.env.ORIGIN_REGEX = "^https://portal\\.example\\.test$";

test("CORS doesn't expose the Authorization header to other origins", async () => {
  const { corsOptions } = require("../config");
  const app = express();
  app.use(cors(corsOptions));
  app.get("/", (req, res) => res.set("Authorization", "Bearer backend-token").send("ok"));
  const server = await listen(app);
  try {
    const res = await fetch(server.url, { headers: { origin: "https://portal.example.test" } });
    const header = res.headers.get("access-control-expose-headers");
    assert.ok(header, "no Access-Control-Expose-Headers");
    const exposed = header.split(",").map((h) => h.trim().toLowerCase());
    assert.ok(!exposed.includes("authorization"), exposed.join(", "));
    // The headers the WebDAV and OCS clients need are still exposed.
    const needed = ["etag", "dav", "content-security-policy", "location", "depth", "content-type", "ocs-apirequest"];
    for (const name of needed) {
      assert.ok(exposed.includes(name), name);
    }
  } finally {
    await server.close();
  }
});
