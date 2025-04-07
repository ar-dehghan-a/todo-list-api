const {Router} = require('express')
const authController = require('../../controllers/authController')

const router = Router()

router.post('/register', authController.register)
router.post('/login', authController.login)

router.patch('/update-password', authController.protect, authController.updatePassword)
router.post('/forgot-password', authController.forgotPassword)
router.patch('/reset-password/:token', authController.resetPassword)

module.exports = router
