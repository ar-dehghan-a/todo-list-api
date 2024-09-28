const Joi = require('joi')

const title = Joi.string().trim().min(2).max(150)
const email = Joi.string().trim().lowercase().email()
const password = Joi.string().min(8)

const validateRegister = body =>
  Joi.object({
    name: title.required(),
    email: email.required(),
    password: password.required(''),
    confirmPassword: Joi.any().equal(Joi.ref('password')).required().messages({
      'any.only': 'the password and confirmPassword must be the same',
    }),
  }).validate(body, {abortEarly: false})

const validateLogin = body =>
  Joi.object({
    password: password.required(),
  }).validate(body, {abortEarly: false})

const validateProfile = body =>
  Joi.object({
    name: title,
    email: email,
  })
    .min(1)
    .validate(body, {abortEarly: false})

const validatePassword = body =>
  Joi.object({
    currentPassword: password.required(),
    newPassword: password.required(),
  }).validate(body, {abortEarly: false})

module.exports = {
  validateRegister,
  validateLogin,
  validateProfile,
  validatePassword,
}
