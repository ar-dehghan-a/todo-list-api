const jwt = require('jsonwebtoken')
const AppError = require('../utils/appError')
const catchAsync = require('../utils/catchAsync')
const {User, validators} = require('../models/User')
const {validateRegister, validateLogin} = validators
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
  if (!user) return next(new AppError('Email or password is incorrect', 403))

  const correct = compareHash(value.password, user.password)
  if (!correct) return next(new AppError('Email or password is incorrect', 403))

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
