require('dotenv').config()

const app = require('./src')
const sequelize = require('./src/config/db')
// const logger = require('./src/config/log')

process.on('uncaughtException', err => {
  console.error(err.name, err.message)
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...')
  process.exit(1)
})

const port = process.env.PORT || 3000
sequelize
  .sync()
  .then(() => app.listen(port, () => console.info(`Server is running at http://localhost:${port}`)))

process.on('unhandledRejection', err => {
  console.error(err.name, err.message)
  console.error('UNHANDLED REJECTION! 💥 Shutting down...')
  process.exit(1)
})
