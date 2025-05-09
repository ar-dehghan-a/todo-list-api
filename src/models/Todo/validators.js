const Joi = require('joi')

const title = Joi.string().trim().min(2).max(150).messages({
  'string.empty': 'Title cannot be empty',
  'string.min': 'Title must be at least 2 characters long',
  'string.max': 'Title cannot exceed 150 characters',
  'any.required': 'Title is required',
})

const note = Joi.string().trim().max(500).allow(null).empty('').messages({
  'string.empty': 'Note cannot be empty',
  'string.max': 'Note cannot exceed 500 characters',
})

const dueDate = Joi.date().allow(null).empty('').messages({
  'date.base': 'Due date must be a valid date',
})

const validateCreateTodo = body =>
  Joi.object({
    title: title.required(),
    isImportant: Joi.boolean(),
    dueDate: dueDate,
  }).validate(body, {abortEarly: false})

const validateUpdateTodo = body =>
  Joi.object({
    title: title,
    note: note,
    dueDate: dueDate,
  })
    .min(1)
    .messages({
      'object.min': 'At least one field (title or note) must be provided for updating.',
    })
    .validate(body, {abortEarly: false})

module.exports = {validateCreateTodo, validateUpdateTodo}
