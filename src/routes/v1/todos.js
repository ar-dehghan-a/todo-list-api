const {Router} = require('express')
const authController = require('../../controllers/authController')
const todoController = require('../../controllers/todoController')

const router = Router()

router.use(authController.protect)

router.route('/').post(todoController.createTodo)

module.exports = router
