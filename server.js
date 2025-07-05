require('dotenv').config()

const http = require('http')
const app = require('./src')
const sequelize = require('./src/config/db')
const {setupNotificationScheduler} = require('./src/services/schedulerService')
// const logger = require('./src/config/log')

process.on('uncaughtException', err => {
  console.error(err.name, err.message)
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...')
  process.exit(1)
})

const PORT = process.env.PORT || 3000
const HOST = '0.0.0.0'

const server = http.createServer(app)

sequelize
  .sync()
  .then(() =>
    server.listen(PORT, HOST, () => {
      console.info(`Server is running at ${HOST}:${PORT}`)

      // Set up scheduler
      setupNotificationScheduler()
    })
  )
  .catch(err => {
    console.error('❌ Unable to connect:', err)
  })

process.on('unhandledRejection', err => {
  console.error(err.name, err.message)
  console.error('UNHANDLED REJECTION! 💥 Shutting down...')
  process.exit(1)
})
