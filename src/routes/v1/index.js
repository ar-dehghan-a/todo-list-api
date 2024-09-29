const {Router} = require('express')
const auth = require('./auth')
const todos = require('./todos')

const router = Router()
router.use('/auth', auth)
router.use('/todos', todos)

module.exports = router
