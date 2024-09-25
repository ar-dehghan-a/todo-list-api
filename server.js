require('dotenv').config()

const app = require('./src')
const sequelize = require('./src/config/db')
const logger = require('./src/config/log')

process.on('uncaughtException', err => {
  logger.error(err.name, err.message)
  logger.error('UNCAUGHT EXCEPTION! 💥 Shutting down...')
  process.exit(1)
})

const port = process.env.PORT || 3000
sequelize
  .sync()
  .then(() => app.listen(port, () => logger.info(`Server is running at http://localhost:${port}`)))

process.on('unhandledRejection', err => {
  logger.error(err.name, err.message)
  logger.error('UNHANDLED REJECTION! 💥 Shutting down...')
  process.exit(1)
})
