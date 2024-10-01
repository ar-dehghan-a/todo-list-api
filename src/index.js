const path = require('path')
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const compression = require('compression')

const mainRouter = require('./routes')

const AppError = require('./utils/appError')
const errorController = require('./controllers/errorController')

const app = express()

// Set security HTTP headers
app.use(helmet())

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 15 * 60 * 1000,
  message: 'Too many requests from this IP, please try again after 15 minutes.',
})
app.use(limiter)

app.use(express.json({limit: '10kb'}))
app.use(express.urlencoded({extended: false}))
app.use(cors())
if (process.env['NODE_ENV'] === 'development') app.use(morgan('dev'))

// Serving static files
app.use(express.static(path.join(__dirname, '../', 'public')))

app.use(compression())

app.use('/api', mainRouter)

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404))
})

app.use(errorController)

module.exports = app
