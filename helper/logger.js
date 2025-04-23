const { createLogger, transports, format } = require("winston");
const fs = require("fs");
const path = require("path");

// Ensure the logs directory exists
const logsDir = path.join(__dirname, "logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Custom log format
const customFormat = format.combine(
  format.timestamp(), // Add timestamp
  format.printf((log) => {
    return `${log.timestamp} | ${log.level.toUpperCase().padEnd(7)} | ${
      log.message
    }`;
  })
);

// Create the logger
const logger = createLogger({
  format: customFormat,
  transports: [
    // Log info messages to app.log
    new transports.File({
      filename: path.join(logsDir, "app.log"),
      level: "info", // Log info and above (info, warn, error)
    }),
    // Log error messages to error.log
    new transports.File({
      filename: path.join(logsDir, "error.log"),
      level: "error", // Log only errors
    }),
    // Log debug messages to debug.log
    new transports.File({
      filename: path.join(logsDir, "debug.log"),
      level: "debug", // Log debug and above (debug, info, warn, error)
    }),
    // Log to the console (optional)
    new transports.Console({
      level: "debug", // Log everything to the console
      format: format.combine(
        format.colorize(), // Add colors to console logs
        format.printf(
          (log) =>
            `${log.timestamp} | ${log.level.toUpperCase().padEnd(7)} | ${
              log.message
            }`
        )
      ),
    }),
  ],
});

module.exports = logger;
