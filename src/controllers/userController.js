const multer = require('multer')
const sharp = require('sharp')
const AppError = require('../utils/appError')
const catchAsync = require('../utils/catchAsync')
const {User, validators, serializer} = require('../models/User')
const {validateUpdate} = validators

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/users');
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `user-${req.query.user.id}-${Date.now()}.${ext}`);
//   },
// });

const multerStorage = multer.memoryStorage()

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) cb(null, true)
  else cb(new AppError('Not an image! Please upload only image', 400), false)
}

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
})

const uploadUserPhoto = upload.single('photo')

const resizeUserPhoto = catchAsync(async (req, _res, next) => {
  if (!req.file) return next()

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`

  sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({quality: 90})
    .toFile(`public/img/users/${req.file.filename}`)

  next()
})

const getUsers = catchAsync(async (_req, res) => {
  const users = await User.findAll()

  res.status(200).json({
    status: 'success',
    data: users.map(user => serializer(user)),
  })
})

const updateUser = catchAsync(async (req, res, next) => {
  const {error, value} = validateUpdate(req.body)
  if (error) return next(new AppError(error, 400))

  if (req.file) value.photo = req.file.filename

  const user = await User.findByPk(req.user.id)
  await user.update(value)

  res.status(200).json({
    status: 'success',
    data: serializer(user),
  })
})

const deleteUser = catchAsync(async (req, res) => {
  const user = await User.findByPk(req.user.id)
  await user.destroy()

  res.status(204).json({
    status: 'success',
  })
})

module.exports = {uploadUserPhoto, resizeUserPhoto, getUsers, updateUser, deleteUser}
