const Joi = require('joi')

const title = Joi.string().trim().min(2).max(150).messages({
  'string.empty': 'Title cannot be empty',
  'string.min': 'Title must be at least 2 characters long',
  'string.max': 'Title cannot exceed 150 characters',
  'any.required': 'Title is required',
})

const note = Joi.string().trim().max(500).allow(null).default(null).empty('').messages({
  'string.empty': 'Note cannot be empty',
  'string.max': 'Note cannot exceed 500 characters',
})

const validateCreateTodo = body =>
  Joi.object({
    title: title.required(),
    note: note,
    isImportant: Joi.boolean(),
  }).validate(body, {abortEarly: false})

const validateUpdateTodo = body =>
  Joi.object({
    title: title,
    note: note,
  })
    .min(1)
    .messages({
      'object.min': 'At least one field (title or note) must be provided for updating.',
    })
    .validate(body, {abortEarly: false})

module.exports = {validateCreateTodo, validateUpdateTodo}
