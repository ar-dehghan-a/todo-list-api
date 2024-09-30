const {promisify} = require('util')
const jwt = require('jsonwebtoken')

const signToken = id =>
  jwt.sign({id}, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  })

const verifyToken = (token, JWT_SECRET) => promisify(jwt.verify)(token, JWT_SECRET)

module.exports = {
  signToken,
  verifyToken,
}
