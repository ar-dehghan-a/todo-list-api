const {Router} = require('express')
const auth = require('./auth')
const users = require('./users')
const todos = require('./todos')
const subscription = require('./subscription')
const files = require('./files')

const router = Router()

router.use('/auth', auth)
router.use('/users', users)
router.use('/todos', todos)
router.use('/subscription', subscription)
router.use('/files', files)

module.exports = router
