const {Router} = require('express')
const authController = require('../../controllers/authController')

const router = Router()

router.post('/register', authController.register)
router.post('/login', authController.login)

router.patch('/updatePassword', authController.protect, authController.updatePassword)
router.post('/forgotPassword', authController.forgotPassword)
router.patch('/resetPassword/:token', authController.resetPassword)

module.exports = router
