const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

const mainRouter = require('./routers')

const AppError = require('./utils/appError')
const errorHandler = require('./controllers/errorHandler')

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cors())
if (process.env['NODE_ENV'] === 'development') app.use(morgan('dev'))

app.get('/', (req, res) => {
  res.send('Todo List API')
})

app.use('/api', mainRouter)

// Catch 404 and forward to error handler
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404))
})

app.use(errorHandler)

module.exports = app
