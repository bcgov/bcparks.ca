import { createLogger, format, transports } from 'winston';

const { combine, timestamp, printf, colorize } = format;

export const getLogger = () => {
    const myFormat = printf(({ level, message, timestamp }) => {
        return `${timestamp}: [${level}] ${message}`;
    });
    return new createLogger({
        format: combine(
            colorize({ all: true }),
            timestamp(),
            myFormat
        ),
        transports: [new transports.Console()]
    });
};

