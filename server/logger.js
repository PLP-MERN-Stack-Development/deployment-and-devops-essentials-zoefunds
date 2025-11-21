// A simple Winston logger with console + file transport and optional Sentry integration.
// Import: const logger = require('./logger'); logger.info('message');

const { createLogger, format, transports } = require('winston');
const path = require('path');

const env = process.env.NODE_ENV || 'development';
const logLevel = process.env.LOG_LEVEL || (env === 'production' ? 'info' : 'debug');

const logger = createLogger({
  level: logLevel,
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.simple()
      )
    }),
    new transports.File({ filename: path.join('logs', `${env}.log`), maxsize: 5_000_000 })
  ],
  exitOnError: false
});

// Optionally capture unhandled exceptions/rejections
logger.exceptions.handle(
  new transports.File({ filename: path.join('logs', 'exceptions.log') })
);

process.on('unhandledRejection', (ex) => {
  logger.error('Unhandled Rejection: %o', ex);
  // in production you may want to exit
});

module.exports = logger;