const {Router} = require('express')
const userController = require('../../controllers/userController')
const authController = require('../../controllers/authController')

const router = Router()

router.use(authController.protect)
router.route('/').get(authController.restrictTo('admin'), userController.getUsers)

module.exports = router
