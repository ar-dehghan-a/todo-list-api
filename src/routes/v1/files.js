const {Router} = require('express')
const authController = require('../../controllers/authController')
const filesController = require('../../controllers/filesController')

const router = Router()

router.use(authController.protect)

router.route('/upload').post(filesController.uploadFile, filesController.processImage)
// router.route('/:id').get(filesController.fileDetails)

module.exports = router
