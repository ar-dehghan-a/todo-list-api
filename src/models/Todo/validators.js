const Joi = require('joi')

const title = Joi.string().trim().min(2).max(150)

const validateCreateTodo = body =>
  Joi.object({
    title: title.required(),
    description: Joi.string(),
  }).validate(body, {abortEarly: false})

const validateUpdateTodo = body =>
  Joi.object({
    title: title,
    description: Joi.string(),
  })
    .min(1)
    .messages({
      'object.min': 'at least one field (title or description) must be provided for updating.',
    })
    .validate(body, {abortEarly: false})

const validateUpdateTodoToggle = body =>
  Joi.object({
    data: Joi.boolean().required(),
  }).validate(body, {abortEarly: false})

module.exports = {validateCreateTodo, validateUpdateTodo, validateUpdateTodoToggle}
