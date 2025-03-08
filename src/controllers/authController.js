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

// Constants
const TOKEN_EXPIRY = process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
const RESET_TOKEN_EXPIRY = 10 * 60 * 1000

// Helper functions
const setJwtCookie = (res, token) => {
  res.cookie('jwt', token, {
    expires: new Date(Date.now() + TOKEN_EXPIRY),
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'strict',
    path: '/',
  })
}

const generateResetToken = () => crypto.randomBytes(32).toString('hex')
const hashResetToken = token => crypto.createHash('sha256').update(token).digest('hex')

const register = catchAsync(async (req, res, next) => {
  const {error, value} = validateRegister(req.body)
  if (error) return next(new AppError(error, 400))

  // Check if user already exists
  const existingUser = await User.findOne({where: {email: value.email}})
  if (existingUser) return next(new AppError('Email already registered', 400))

  // Hash password
  value.password = generateHash(value.password)
  value.confirmPassword = undefined

  const newUser = await User.create(value)
  const token = signToken(newUser.id)

  setJwtCookie(res, token)

  logger.info(`New user registered: ${newUser.email}`)

  res.status(201).json({
    status: 'success',
    token,
  })
})

const login = catchAsync(async (req, res, next) => {
  const {error, value} = validateLogin(req.body)
  if (error) return next(new AppError(error, 400))

  const user = await User.findOne({where: {email: value.email}})
  if (!user) return next(new AppError('Email or password is incorrect', 401))

  const correct = compareHash(value.password, user.password)
  if (!correct) return next(new AppError('Email or password is incorrect', 401))

  const token = signToken(user.id)
  setJwtCookie(res, token)

  res.status(200).json({
    status: 'success',
    token,
  })
})

const protect = catchAsync(async (req, res, next) => {
  let token = ''
  if (req.headers.authorization?.startsWith('Bearer'))
    token = req.headers.authorization.split(' ')[1]
  else if (req.cookies.jwt) token = req.cookies.jwt

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

const restrictTo =
  (...roles) =>
  (req, _res, next) => {
    if (!roles.includes(req.user.role))
      return next(new AppError("You don't have access to this operation", 403))

    next()
  }

const updatePassword = catchAsync(async (req, res, next) => {
  const {error, value} = validatePassword(req.body)
  if (error) return next(new AppError(error, 400))

  const user = await User.findOne({where: {id: req.user.id}})

  const correct = compareHash(value.currentPassword, user.password)
  if (!correct) return next(new AppError('Your current password is incorrect', 401))

  const hashedPassword = generateHash(value.newPassword)
  await user.update({password: hashedPassword})

  const token = signToken(user.id)
  setJwtCookie(res, token)

  res.status(200).json({
    status: 'success',
    token,
  })
})

const forgotPassword = catchAsync(async (req, res, next) => {
  const {error, value} = validateForgotPassword(req.body)
  if (error) return next(new AppError(error, 400))

  const user = await User.findOne({where: {email: value.email}})

  // Don't reveal if email exists or not for security
  if (!user)
    return res.status(200).json({
      status: 'success',
      message: 'If the email exists, a reset token has been sent.',
    })

  const resetToken = generateResetToken()
  const hashedToken = hashResetToken(resetToken)
  const resetURL = `${req.protocol}://${req.get('host')}/api/v1/auth/resetPassword/${resetToken}`

  await user.update({
    passwordResetToken: hashedToken,
    passwordResetExpires: Date.now() + RESET_TOKEN_EXPIRY,
  })

  const message = `Did you forget your password? Send the new password and confirmation of the new password with a patch request to this address:\n${resetURL}\nIf you have not forgotten your password, do not pay attention to this email.`

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password change token (valid for 10 minutes)',
      message,
    })

    res.status(200).json({
      status: 'success',
      message: 'If the email exists, a reset token has been sent.',
    })
  } catch (err) {
    logger.error(`Failed to send password reset email: ${err.message}`)

    await user.update({
      passwordResetToken: null,
      passwordResetExpires: null,
    })

    return next(new AppError('There was a problem sending the email. Please try again later.', 500))
  }
})

const resetPassword = catchAsync(async (req, res, next) => {
  const {error, value} = validateResetPassword(req.body)
  if (error) return next(new AppError(error, 400))

  const hashedToken = hashResetToken(req.params.token)

  const user = await User.findOne({
    where: {
      passwordResetToken: hashedToken,
      passwordResetExpires: {
        [Op.gt]: Date.now(),
      },
    },
  })

  if (!user) return next(new AppError('Your token is not valid or has expired.', 401))

  const hashedPassword = generateHash(value.newPassword)
  await user.update({
    password: hashedPassword,
    passwordResetToken: null,
    passwordResetExpires: null,
  })

  const token = signToken(user.id)
  setJwtCookie(res, token)

  res.status(200).json({
    status: 'success',
    token,
  })
})

module.exports = {
  register,
  login,
  protect,
  restrictTo,
  updatePassword,
  forgotPassword,
  resetPassword,
}
