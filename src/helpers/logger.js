const winston = require("winston");

const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.printf((info) => {
    return JSON.stringify({
      level: info.level,
      message: info.message,
      timestamp: info.timestamp,
    });
  })
);

const logger = winston.createLogger({
  level: "info",
  format: logFormat,
  transports: [
    new winston.transports.File({
      filename: "errors.log",
      level: "error",
    }),

    new winston.transports.Console({
      format: logFormat,
    }),
  ],

  handleExceptions: true,
});

module.exports = logger;