/**
 * SPDX-License-Identifier: AGPL-3.0-only
 * SPDX-FileCopyrightText: 2024 Univention GmbH
 */

const winston = require("winston");

const { logLevel } = require("../config");

const logger = winston.createLogger({
  level: logLevel,
  format: winston.format.json(),
  defaultMeta: { service: "intercom-service" },
  transports: [
    new winston.transports.Console({ level: logLevel }),
    new winston.transports.File({
      filename: "intercom-service.log",
      level: logLevel,
    }),
  ],
});

module.exports = {
  logger,
};
