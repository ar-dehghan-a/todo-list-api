const Joi = require('joi')

const title = Joi.string().trim().min(2).max(150)

const validateCreateTodo = body =>
  Joi.object({
    title: title.required(),
    note: Joi.string(),
  }).validate(body, {abortEarly: false})

const validateUpdateTodo = body =>
  Joi.object({
    title: title,
    note: Joi.string(),
  })
    .min(1)
    .messages({
      'object.min': 'at least one field (title or note) must be provided for updating.',
    })
    .validate(body, {abortEarly: false})

module.exports = {validateCreateTodo, validateUpdateTodo}
