const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

const mainRouter = require('./routes')

const AppError = require('./utils/appError')
const errorController = require('./controllers/errorController')

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cors())
if (process.env['NODE_ENV'] === 'development') app.use(morgan('dev'))

app.get('/', (req, res) => {
  res.send('Todo List API')
})

app.use('/api', mainRouter)

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404))
})

app.use(errorController)

module.exports = app
