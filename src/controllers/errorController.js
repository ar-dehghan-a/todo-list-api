const logger = require('../config/log')
const AppError = require('../utils/appError')

const handleValidationErrorDB = err => {
  const errors = err.errors.map(el => el.message)

  const message = `Invalid input data. ${errors.join('. ')}`
  return new AppError(message, 400)
}

const handleUniqueErrorDB = err => {
  const errors = err.errors.map(el => `user with ${el.path} ${el.value} already exists`)

  const message = `Duplicate field value. ${errors.join('. ')}`
  return new AppError(message, 409)
}

const handleJWTError = () => new AppError('The token is incorrect. Please login again.', 401)

const handleJWTExpiredError = () => new AppError('Your token has expired. Please login again.', 401)

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  })
}

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    })
  } else {
    logger.error('ERROR 💥', err)

    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    })
  }
}

module.exports = (err, req, res, next) => {
  let error = err

  error.statusCode = err.statusCode || 500
  error.status = err.status || 'error'

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, res)
  } else if (process.env.NODE_ENV === 'production') {
    if (error.name === 'SequelizeValidationError') error = handleValidationErrorDB(error)
    if (error.name === 'SequelizeUniqueConstraintError') error = handleUniqueErrorDB(error)
    // if (error.name === 'JsonWebTokenError') error = handleJWTError()
    // if (error.name === 'TokenExpiredError') error = handleJWTExpiredError()

    sendErrorProd(error, res)
  }
}
