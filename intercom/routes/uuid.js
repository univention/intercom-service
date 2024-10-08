/**
 * SPDX-License-Identifier: AGPL-3.0-only
 * SPDX-FileCopyrightText: 2024 Univention GmbH
 */

const express = require("express");
const router = express.Router();

/**
 * @name /uuid
 * @desc returns the uuid of the logged in user
 * @example GET http://ics.domain.test/uuid
 */
router.get("/", (req, res) => {
  let entryUUID =
    req.decodedIdToken[process.env.USER_UNIQUE_MAPPER ?? "entryuuid"];
  res.send(entryUUID);
});

module.exports = router;
