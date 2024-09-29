const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const {validators, Todo, serializer} = require('../models/Todo')
const {validateCreateTodo} = validators

const createTodo = catchAsync(async (req, res, next) => {
  const {error, value} = validateCreateTodo(req.body)

  if (error) return next(new AppError(error, 400))

  const newTodo = await Todo.create({...value, userId: req.user.id})

  res.status(201).json({
    status: 'success',
    data: serializer(newTodo),
  })
})

module.exports = {createTodo}
