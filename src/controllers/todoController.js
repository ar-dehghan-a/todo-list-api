const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const {validators, Todo, serializer} = require('../models/Todo')
const {validateCreateTodo, validateUpdateTodo} = validators

const createTodo = catchAsync(async (req, res, next) => {
  const {error, value} = validateCreateTodo(req.body)

  if (error) return next(new AppError(error, 400))

  const newTodo = await Todo.create({...value, userId: req.user.id})

  res.status(201).json({
    status: 'success',
    data: serializer(newTodo),
  })
})

const updateTodo = catchAsync(async (req, res, next) => {
  const {id} = req.params
  const {error, value} = validateUpdateTodo(req.body)

  if (error) return next(new AppError(error, 400))

  const todo = await Todo.findByPk(id)

  if (!todo) return next(new AppError('Todo not found', 404))

  if (req.user.id !== todo.userId)
    return next(new AppError('You do not have permission to update this todo.', 403))

  await todo.update(value)

  res.status(200).json({
    status: 'success',
    data: serializer(todo),
  })
})

const deleteTodo = catchAsync(async (req, res, next) => {
  const {id} = req.params

  const todo = await Todo.findByPk(id)

  if (!todo) return next(new AppError('Todo not found', 404))

  if (req.user.id !== todo.userId)
    return next(new AppError('You do not have permission to update this todo.', 403))

  await todo.destroy()

  res.status(204).json({
    status: 'success',
  })
})

module.exports = {createTodo, updateTodo, deleteTodo}
