const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const {validators, Todo, serializer} = require('../models/Todo')
const {validateCreateTodo, validateUpdateTodo} = validators
const pagination = require('../utils/pagination')

const getTodo = catchAsync(async (req, res, next) => {
  const {id} = req.params

  if (!id || isNaN(Number(id))) return next(new AppError('Invalid Todo ID.', 400))

  const todo = await Todo.findOne({
    where: {id, userId: req.user.id},
  })

  if (!todo) return next(new AppError('Todo not found.', 404))

  res.status(200).json({
    status: 'success',
    data: serializer(todo),
  })
})

const getTodos = catchAsync(async (req, res) => {
  const {isCompleted, isImportant, sortBy} = req.query
  const {page, limit, offset} = pagination(req.query)

  let where = {userId: req.user.id}

  if (isCompleted !== undefined) where.isCompleted = isCompleted === 'true'
  if (isImportant !== undefined) where.isImportant = isImportant === 'true'

  const order = {
    0: ['doneAt', 'ASC'],
    1: ['doneAt', 'DESC'],
    2: ['createdAt', 'ASC'],
  }[sortBy] || ['createdAt', 'DESC']

  const todos = await Todo.findAndCountAll({
    where,
    limit,
    offset,
    order: [order],
  })

  const data = todos.rows.map(serializer)

  res.status(200).json({
    status: 'success',
    data,
    meta: {
      page,
      limit,
      total: todos.count,
    },
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

  const todo = await Todo.findOne({
    where: {id, userId: req.user.id},
  })

  if (!todo) return next(new AppError('Todo not found.', 404))

  let dayBeforeNotificationSent = todo.dayBeforeNotificationSent
  let dueDateNotificationSent = todo.dueDateNotificationSent

  if (value.dueDate !== undefined && value.dueDate !== todo.dueDate) {
    dayBeforeNotificationSent = false
    dueDateNotificationSent = false
  }

  await todo.update({...value, dayBeforeNotificationSent, dueDateNotificationSent})

  res.status(200).json({
    status: 'success',
    data: serializer(todo),
  })
})

const deleteTodo = catchAsync(async (req, res, next) => {
  const {id} = req.params

  const deletedCount = await Todo.destroy({
    where: {id, userId: req.user.id},
  })

  if (!deletedCount) return next(new AppError('Todo not found.', 404))

  res.status(204).json({
    status: 'success',
    message: 'Todo successfully deleted.',
  })
})

const toggleTodoCompleted = catchAsync(async (req, res, next) => {
  const {id} = req.params

  const todo = await Todo.findOne({where: {id, userId: req.user.id}})
  if (!todo) return next(new AppError('Todo not found.', 404))

  const newStatus = !todo.isCompleted
  await todo.update({isCompleted: newStatus, doneAt: newStatus ? new Date() : null})

  res.status(200).json({
    status: 'success',
    data: serializer(todo),
  })
})

const toggleTodoImportant = catchAsync(async (req, res, next) => {
  const {id} = req.params

  const todo = await Todo.findOne({where: {id, userId: req.user.id}})
  if (!todo) return next(new AppError('Todo not found.', 404))

  const newStatus = !todo.isImportant
  await todo.update({isImportant: newStatus})

  res.status(200).json({
    status: 'success',
    data: serializer(todo),
  })
})

module.exports = {
  getTodo,
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  toggleTodoCompleted,
  toggleTodoImportant,
}
