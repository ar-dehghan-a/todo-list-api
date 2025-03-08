const {Router} = require('express')
const userController = require('../../controllers/userController')
const authController = require('../../controllers/authController')

const router = Router()

router.use(authController.protect)

router
  .route('/')
  .get(authController.restrictTo('admin'), userController.getUsers)
  .patch(userController.updateUser)
  .delete(userController.deleteUser)

router.route('/me').get(userController.getUser)

module.exports = router
