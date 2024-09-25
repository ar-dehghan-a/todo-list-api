const {createHash} = require('crypto')

const generateHash = value => {
  const hash = createHash('sha256')
  hash.update(value)
  const digest = hash.digest('hex')
  return digest
}

const compareHash = (value, digest) => {
  const hash = generateHash(value)
  return digest === hash
}

module.exports = {generateHash, compareHash}
