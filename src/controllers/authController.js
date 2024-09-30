const {promisify} = require('util')
const jwt = require('jsonwebtoken')
const AppError = require('../utils/appError')
const catchAsync = require('../utils/catchAsync')
const {User, validators} = require('../models/User')
const {validateRegister, validateLogin, validatePassword} = validators
const {generateHash, compareHash} = require('../utils/hash')

const signToken = id =>
  jwt.sign({id}, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  })

exports.register = catchAsync(async (req, res, next) => {
  const {error, value} = validateRegister(req.body)

  if (error) return next(new AppError(error, 400))

  value.password = generateHash(value.password)
  value.confirmPassword = undefined

  const newUser = await User.create(value)
  const token = signToken(newUser.id)

  res.cookie('jwt', token, {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
  })

  res.status(201).json({
    status: 'success',
    token,
  })
})

exports.login = catchAsync(async (req, res, next) => {
  const {error, value} = validateLogin(req.body)

  if (error) return next(new AppError(error, 400))

  const user = await User.findOne({where: {email: value.email}})
  if (!user) return next(new AppError('Email or password is incorrect', 401))

  const correct = compareHash(value.password, user.password)
  if (!correct) return next(new AppError('Email or password is incorrect', 401))

  const token = signToken(user.id)

  res.cookie('jwt', token, {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
  })

  res.status(200).json({
    status: 'success',
    token,
  })
})

exports.protect = catchAsync(async (req, res, next) => {
  let token = ''
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
    token = req.headers.authorization.split(' ')[1]

  if (!token) return next(new AppError('Access denied. Please login again.', 401))

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)

  const user = await User.findByPk(decoded.id)
  if (!user) return next(new AppError('Access denied. Please login again.', 401))

  const changedTimestamp = parseInt(user.passwordChangedAt?.getTime() / 1000 || 0, 10)
  if (changedTimestamp > decoded.iat)
    return next(new AppError('Password was recently changed. Please log in again.', 401))

  req.user = user.toJSON()

  next()
})

exports.restrictTo =
  (...roles) =>
  (req, _res, next) => {
    if (!roles.includes(req.query.user.role))
      return next(new AppError("You don't have access to this operation", 403))

    next()
  }

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findByPk(req.user.id)

  const {error, value} = validatePassword(req.body)
  if (error) return next(new AppError(error, 400))

  const correct = compareHash(value.currentPassword, user.password)
  if (!correct) return next(new AppError('Your current password is incorrect', 401))

  value.newPassword = generateHash(value.newPassword)
  value.confirmPassword = undefined

  await user.update({
    password: value.newPassword,
    passwordChangedAt: new Date().toISOString(),
  })

  const token = signToken(user.id)

  res.cookie('jwt', token, {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
  })

  res.status(200).json({
    status: 'success',
    token,
  })
})
