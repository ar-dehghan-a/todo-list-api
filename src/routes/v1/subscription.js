const {Router} = require('express')
const authController = require('../../controllers/authController')
const subscriptionController = require('../../controllers/subscriptionController')

const router = Router()

router.post('/subscribe', authController.protect, subscriptionController.subscribe)
router.get('/public-key', subscriptionController.getPublicKey)

module.exports = router
