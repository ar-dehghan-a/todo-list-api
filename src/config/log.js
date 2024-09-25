const winston = require('winston')

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: './logs/error.log',
      level: 'error',
      maxsize: 1024 * 1024,
    }),
    new winston.transports.File({filename: './logs/combined.log', maxsize: 2 * 1024 * 1024}),
  ],
})

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.printf(({timestamp, level, message}) => {
          return `${timestamp} [${level}]: ${message}`
        })
      ),
    })
  )
}

module.exports = logger
