/**
 * SPDX-License-Identifier: AGPL-3.0-only
 * SPDX-FileCopyrightText: 2024-2025 Univention GmbH
 */

const fs = require("node:fs");
const winston = require("winston");

const { logLevel, logFile } = require("../config");

const logger = winston.createLogger({
  level: logLevel,
  format: winston.format.combine(
    winston.format.splat(),
    winston.format.simple(),
    winston.format.json(),
  ),
  defaultMeta: { service: "intercom-service" },
  transports: [new winston.transports.Console({ level: logLevel })],
});

// winston never reports a file it failed to open, it just retains every record
// in memory instead, so check up front rather than waiting for an error.
const canWrite = (filename) => {
  try {
    fs.closeSync(fs.openSync(filename, "a"));
    return true;
  } catch (error) {
    logger.error(
      `Not logging to ${filename}, it cannot be written: ${error.message}`,
    );
    return false;
  }
};

if (logFile && canWrite(logFile)) {
  const fileTransport = new winston.transports.File({
    filename: logFile,
    level: logLevel,
    maxsize: 10 * 1024 * 1024,
    maxFiles: 3,
    tailable: true,
  });

  fileTransport.on("error", (error) => {
    logger.remove(fileTransport);
    logger.error(
      `Disabled the log file ${logFile}, it cannot be written: ${error.message}`,
    );
  });

  logger.add(fileTransport);
}

logger.on("error", (error) => {
  console.error(`Logger error: ${error.message}`);
});

module.exports = {
  logger,
};
