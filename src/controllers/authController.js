const {Op} = require('sequelize')
const crypto = require('crypto')
const {signToken, verifyToken} = require('../utils/token')
const logger = require('../config/log')
const AppError = require('../utils/appError')
const catchAsync = require('../utils/catchAsync')
const {generateHash, compareHash} = require('../utils/hash')
const sendEmail = require('../utils/email')
const {User, validators} = require('../models/User')
const {
  validateRegister,
  validateLogin,
  validatePassword,
  validateForgotPassword,
  validateResetPassword,
} = validators

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

  if (!token) return next(new AppError('Unauthorized. Please login again.', 401))

  const decoded = await verifyToken(token, process.env.JWT_SECRET)

  const user = await User.findByPk(decoded.id)
  if (!user) return next(new AppError('Unauthorized. Please login again.', 401))

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
  const {error, value} = validatePassword(req.body)
  if (error) return next(new AppError(error, 400))

  const user = await User.findByPk(req.user.id)

  const correct = compareHash(value.currentPassword, user.password)
  if (!correct) return next(new AppError('Your current password is incorrect', 401))

  value.newPassword = generateHash(value.newPassword)
  value.confirmPassword = undefined

  await user.update({
    password: value.newPassword,
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

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const {error, value} = validateForgotPassword(req.body)
  if (error) return next(new AppError(error, 400))

  const user = await User.findOne({where: {email: value.email}})
  if (!user) return next(new AppError('There is no user with this email', 404))

  const resetToken = crypto.randomBytes(32).toString('hex')
  const resetURL = `${req.protocol}://${req.get('host')}/api/v1/auth/resetPassword/${resetToken}`
  const message = `Did you forget your password? Send the new password and confirmation of the new password with a patch request to this address:\n${resetURL}\nIf you have not forgotten your password, do not pay attention to this email.`

  await user.update({
    passwordResetToken: crypto.createHash('sha256').update(resetToken).digest('hex'),
    passwordResetExpires: Date.now() + 10 * 60 * 1000,
  })

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password change token (valid for 10 minutes)',
      message,
    })

    res.status(200).json({
      status: 'success',
      message: 'The token has been sent to your email',
    })
  } catch (err) {
    logger.error(err)

    await user.update({
      passwordResetToken: null,
      passwordResetExpires: null,
    })
    return next(new AppError('There was a problem sending the email. Please try again later.', 500))
  }
})

exports.resetPassword = catchAsync(async (req, res, next) => {
  const {error, value} = validateResetPassword(req.body)
  if (error) return next(new AppError(error, 400))

  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex')
  const user = await User.findOne({
    where: {
      passwordResetToken: hashedToken,
      passwordResetExpires: {
        [Op.gt]: Date.now(),
      },
    },
  })

  if (!user) return next(new AppError('Your token is not valid or has expired.', 401))

  value.newPassword = generateHash(value.newPassword)
  value.confirmPassword = undefined

  await user.update({
    password: value.newPassword,
    passwordResetToken: null,
    passwordResetExpires: null,
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
