const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const {validators, Todo, serializer} = require('../models/Todo')
const {validateCreateTodo, validateUpdateTodo} = validators
const pagination = require('../utils/pagination')

const getTodos = catchAsync(async (req, res) => {
  const {isCompleted, isImportant, sortBy} = req.query
  const {page, limit, offset} = pagination(req.query)

  let where = {userId: req.user.id}

  isCompleted === 'true' && (where.isCompleted = true)
  isCompleted === 'false' && (where.isCompleted = false)

  isImportant === 'true' && (where.isImportant = true)
  isImportant === 'false' && (where.isImportant = false)

  let order = []

  switch (sortBy) {
    case '0':
      order.push([['doneAt', 'ASC']])
      break

    case '1':
      order.push([['doneAt', 'DESC']])
      break

    case '2':
      order.push([['createdAt', 'ASC']])
      break

    default:
      order.push([['createdAt', 'DESC']])
      break
  }

  const todos = await Todo.findAndCountAll({
    where,
    limit,
    offset,
    order,
  })

  res.status(200).json({
    status: 'success',
    data: todos.rows.map(todo => serializer(todo)),
    page,
    limit,
    total: todos.count,
  })
})

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

module.exports = {getTodos, createTodo, updateTodo, deleteTodo}
