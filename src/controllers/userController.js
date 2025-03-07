const AppError = require('../utils/appError')
const catchAsync = require('../utils/catchAsync')
const {User, validators, serializer} = require('../models/User')
const {validateUpdate} = validators
const {File} = require('../models/File')

const getUsers = catchAsync(async (_req, res) => {
  const users = await User.findAll()

  res.status(200).json({
    status: 'success',
    data: users.map(user => serializer(user)),
  })
})

const updateUser = catchAsync(async (req, res, next) => {
  const {error, value} = validateUpdate(req.body)
  if (error) return next(new AppError(error, 400))

  const user = await User.findByPk(req.user.id)
  if (!user) return next(new AppError('User not found.', 404))

  if (value.photo) {
    const file = await File.findByPk(value.photo)
    if (!file) return next(new AppError('File not found.', 404))

    if (!file.mimeType.startsWith('image/'))
      return next(new AppError('File must be an image.', 400))

    value.photo = file.id
  }

  await user.update(value)

  res.status(200).json({
    status: 'success',
    data: serializer(user),
  })
})

const deleteUser = catchAsync(async (req, res, next) => {
  const deletedCount = await User.destroy({where: {id: req.user.id}})
  if (!deletedCount) return next(new AppError('User not found.', 404))

  res.status(204).json({
    status: 'success',
    message: 'User account deleted successfully.',
  })
})

module.exports = {getUsers, updateUser, deleteUser}
