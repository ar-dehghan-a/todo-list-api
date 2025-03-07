const fs = require('fs')
const multer = require('multer')
const sharp = require('sharp')
const AppError = require('../utils/appError')
const catchAsync = require('../utils/catchAsync')
const {File, serializer} = require('../models/File')

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

  const {originalname, mimetype, size, buffer, fieldname} = req.file

  const filename = `${fieldname}-${Date.now()}`
  const ext = mimetype.startsWith('image/') ? 'jpeg' : mimetype.split('/')[1]
  const uploadDir = 'public/uploads'
  const filePath = `${uploadDir}/${filename}.${ext}`
  const fileUrl = `/uploads/${filename}.${ext}`

  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, {recursive: true})

  if (mimetype.startsWith('image/'))
    await sharp(buffer).toFormat('jpeg').jpeg({quality: 90}).toFile(filePath)
  else await fs.promises.writeFile(filePath, buffer)

  const file = await File.create({
    filename: originalname,
    mimeType: mimetype,
    size,
    url: fileUrl,
    path: filePath,
    isPublic: true,
  })

  file.url = `${req.protocol}://${req.get('host')}${file.url}`

  res.status(201).json({
    status: 'success',
    data: serializer(file),
  })
})

module.exports = {
  uploadFile,
  processImage,
}
