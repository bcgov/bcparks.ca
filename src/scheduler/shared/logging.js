const { createLogger, format, transports } = require("winston");

const { combine, timestamp, printf, colorize } = format;

exports.getLogger = () => {
  const myFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp}: [${level}] ${message}`;
  });
  return new createLogger({
    format: combine(colorize({ all: true }), timestamp(), myFormat),
    transports: [new transports.Console()],
  });
};
