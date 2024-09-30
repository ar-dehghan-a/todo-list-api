const {Router} = require('express')
const authController = require('../../controllers/authController')
const todoController = require('../../controllers/todoController')

const router = Router()

router.use(authController.protect)

router.route('/').get(todoController.getTodos).post(todoController.createTodo)
router
  .route('/:id')
  .get(todoController.getTodo)
  .patch(todoController.updateTodo)
  .delete(todoController.deleteTodo)

module.exports = router
