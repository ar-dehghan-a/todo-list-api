const AppError = require('../utils/appError')
const catchAsync = require('../utils/catchAsync')
const {User, serializer} = require('../models/User')

const getUsers = catchAsync(async (req, res) => {
  const users = await User.findAll()

  res.status(200).json({
    status: 'success',
    data: users.map(user => serializer(user)),
  })
})

module.exports = {getUsers}
