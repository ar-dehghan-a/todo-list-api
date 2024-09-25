require('dotenv').config()

const app = require('./src')
const logger = require('./src/config/log')

const dev = process.env['NODE_ENV'] === 'development'
const port = process.env.PORT || 3000

app.listen(port, () => {
  logger.info(`Server is running at http://localhost:${port}`)
})
