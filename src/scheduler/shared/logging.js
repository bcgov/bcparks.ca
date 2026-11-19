const { createLogger, format, transports } = require("winston");
const { writeTaskError } = require("./taskErrors");

const { combine, timestamp, printf, colorize } = format;

/**
 * Creates the scheduler logger. logger.error() takes an optional queued-task
 * documentId; when one is passed, the message is also saved to the PVC as
 * that task's last error.
 *
 * @returns {Object} Winston logger.
 */
exports.getLogger = () => {
  const myFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp}: [${level}] ${message}`;
  });
  const logger = new createLogger({
    format: combine(colorize({ all: true }), timestamp(), myFormat),
    transports: [new transports.Console()],
  });

  const logError = logger.error.bind(logger);
  logger.error = (message, documentId) => {
    logError(message);
    if (documentId && typeof documentId === "string") {
      try {
        writeTaskError(documentId, `${message}`);
      } catch (error) {
        logger.warn(
          `Could not save the error for task ${documentId}: ${error}`,
        );
      }
    }
  };

  return logger;
};
