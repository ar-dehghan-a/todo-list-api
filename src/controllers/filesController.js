const multer = require('multer')
const AppError = require('../utils/appError')
const catchAsync = require('../utils/catchAsync')
const {File, serializer} = require('../models/File')
const {uploadFileStorage} = require('../services/storage')

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
  const allowedMimeTypes = [
    // Images
    'image/jpg',
    'image/jpeg',
    'image/png',
    'image/webp',
    // PDF
    'application/pdf',
  ]

  if (allowedMimeTypes.includes(file.mimetype)) cb(null, true)
  else cb(new AppError('Invalid file type! Please upload only images and PDF files.', 400), false)
}

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
})

const uploadFile = upload.single('file')

const processImage = catchAsync(async (req, res, next) => {
  if (!req.file) return next(new AppError('No file uploaded', 400))

  const {originalname, mimetype, buffer, fieldname} = req.file

  const filename = `${fieldname}-${Date.now()}`
  const ext = mimetype.startsWith('image/') ? 'jpeg' : mimetype.split('/')[1]
  const filePath = `uploads/${filename}.${ext}`

  const {path, url, size} = await uploadFileStorage(buffer, filePath, mimetype)

  const file = await File.create({
    filename: originalname,
    mimeType: mimetype,
    size,
    url: url,
    path: path,
    isPublic: true,
  })

  res.status(201).json({
    status: 'success',
    data: serializer(file),
  })
})

module.exports = {
  uploadFile,
  processImage,
}
