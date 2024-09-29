const Joi = require('joi')

const validateCreateTodo = body =>
  Joi.object({
    title: Joi.string().required(),
    description: Joi.string().optional(),
  }).validate(body, {abortEarly: false})

module.exports = {validateCreateTodo}
