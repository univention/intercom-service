/**
 * SPDX-License-Identifier: AGPL-3.0-only
 * SPDX-FileCopyrightText: 2023 Univention GmbH
 */

const winston = require("winston");

const level = `${process.env.LOG_LEVEL}`.toLowerCase() ?? "info";

const logger = winston.createLogger({
  level,
  format: winston.format.json(),
  defaultMeta: { service: "intercom-service" },
  transports: [
    new winston.transports.Console({ level }),
    new winston.transports.File({ filename: "intercom-service.log", level}),
  ],
});

module.exports = {
  logger
};
