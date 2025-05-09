const {saveUserSubscription} = require('../services/notificationService')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')

const subscribe = catchAsync(async (req, res, next) => {
  const {subscription} = req.body
  const userId = req.user.id

  if (!subscription) next(new AppError('Subscription object is required.', 400))

  const success = await saveUserSubscription(userId, subscription)

  if (!success) next(new AppError('Failed to save subscription.', 500))

  res.status(201).json({
    status: 'success',
    message: 'Subscription saved',
  })
})

const getPublicKey = (_req, res) => {
  res.status(200).json({
    status: 'success',
    publicKey: process.env.PUBLIC_VAPID_KEY,
  })
}

module.exports = {subscribe, getPublicKey}
