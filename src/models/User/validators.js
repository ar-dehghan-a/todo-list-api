const Joi = require('joi')

const title = Joi.string().trim().min(2).max(150).messages({
  'string.empty': 'Name cannot be empty',
  'string.min': 'Name must be at least 2 characters long',
  'string.max': 'Name cannot exceed 150 characters',
  'any.required': 'Name is required',
})

const email = Joi.string().trim().lowercase().email().max(255).messages({
  'string.empty': 'Email cannot be empty',
  'string.email': 'Please enter a valid email address',
  'string.max': 'Email cannot exceed 255 characters',
  'any.required': 'Email is required',
})

const password = Joi.string().min(8).max(100).messages({
  'string.empty': 'Password cannot be empty',
  'string.min': 'Password must be at least 8 characters long',
  'string.max': 'Password cannot exceed 100 characters',
  'any.required': 'Password is required',
})

const validateRegister = body =>
  Joi.object({
    name: title.required(),
    surname: title.required(),
    email: email.required(),
    password: password.required(),
    confirmPassword: Joi.any().equal(Joi.ref('password')).required().messages({
      'any.only': 'Passwords do not match',
      'any.required': 'Please confirm your password',
    }),
  }).validate(body, {abortEarly: false})

const validateLogin = body =>
  Joi.object({
    email: email.required(),
    password: password.required(),
  }).validate(body, {abortEarly: false})

const validateUpdate = body =>
  Joi.object({
    name: title,
    surname: title,
    email: email,
  }).validate(body, {abortEarly: false})

const validatePassword = body =>
  Joi.object({
    currentPassword: password.required(),
    newPassword: password.required(),
    confirmPassword: Joi.any().equal(Joi.ref('newPassword')).required().messages({
      'any.only': 'New passwords do not match',
      'any.required': 'Please confirm your new password',
    }),
  }).validate(body, {abortEarly: false})

const validateForgotPassword = body =>
  Joi.object({
    email: email.required(),
  }).validate(body, {abortEarly: false})

const validateResetPassword = body =>
  Joi.object({
    newPassword: password.required(),
    confirmPassword: Joi.any().equal(Joi.ref('newPassword')).required().messages({
      'any.only': 'New passwords do not match',
      'any.required': 'Please confirm your new password',
    }),
  }).validate(body, {abortEarly: false})

module.exports = {
  validateRegister,
  validateLogin,
  validateUpdate,
  validatePassword,
  validateForgotPassword,
  validateResetPassword,
}
