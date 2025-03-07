const {Router} = require('express')
const auth = require('./auth')
const todos = require('./todos')
const user = require('./user')
const files = require('./files')

const router = Router()

router.use('/files', files)
router.use('/auth', auth)
router.use('/todos', todos)
router.use('/user', user)

module.exports = router
