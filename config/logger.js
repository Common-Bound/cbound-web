const winston = require("winston");
require("winston-daily-rotate-file");
const { printf } = winston.format;
const morgan = require("morgan");

/* logger */
const transport = new winston.transports.DailyRotateFile({
  filename: "%DATE%.log",
  datePattern: "YYYY-MM-DD-HH",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "14d",
  dirname: "log/"
});
const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss"
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json(),
    myFormat
  ),
  defaultMeta: { service: "common-bound" },
  transports: [transport, new winston.transports.Console()]
});
logger.stream = {
  write: function(message, encoding) {
    logger.info(message);
  }
};

module.exports = logger;
