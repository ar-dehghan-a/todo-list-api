const AppError = require('../utils/appError')
const catchAsync = require('../utils/catchAsync')
const {User, serializer} = require('../models/User')

const getUsers = catchAsync(async (_req, res) => {
  const users = await User.findAll()

  res.status(200).json({
    status: 'success',
    data: users.map(user => serializer(user)),
  })
})

const deleteUser = catchAsync(async (req, res) => {
  const user = await User.findByPk(req.user.id)
  await user.destroy()

  res.status(204).json({
    status: 'success',
  })
})

module.exports = {getUsers, deleteUser}
