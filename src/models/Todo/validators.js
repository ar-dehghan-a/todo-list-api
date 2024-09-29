const Joi = require('joi')

const validateCreateTodo = body =>
  Joi.object({
    title: Joi.string().required(),
    description: Joi.string(),
  }).validate(body, {abortEarly: false})

const validateUpdateTodo = body =>
  Joi.object({
    title: Joi.string().optional(),
    description: Joi.string().optional(),
  })
    .min(1)
    .messages({
      'object.min': 'at least one field (title or description) must be provided for updating.',
    })
    .validate(body, {abortEarly: false})

module.exports = {validateCreateTodo, validateUpdateTodo}
