const {S3} = require('@aws-sdk/client-s3')
const multer = require('multer')
const multerS3 = require('multer-s3')
const AppError = require('../utils/appError')
const catchAsync = require('../utils/catchAsync')
const {File, serializer} = require('../models/File')

const {NODE_ENV, BASE_URL, LIARA_ENDPOINT, LIARA_BUCKET_NAME, LIARA_ACCESS_KEY, LIARA_SECRET_KEY} =
  process.env

const config = {
  endpoint: LIARA_ENDPOINT,
  accessKeyId: LIARA_ACCESS_KEY,
  secretAccessKey: LIARA_SECRET_KEY,
  region: 'default',
}

const s3 = new S3(config)

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads')
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1]
    cb(null, `${file.fieldname}-${Date.now()}.${ext}`)
  },
})

const uploadS3 = multerS3({
  s3,
  bucket: LIARA_BUCKET_NAME,
  key: function (req, file, cb) {
    const ext = file.mimetype.split('/')[1]
    cb(null, `${file.fieldname}-${Date.now()}.${ext}`)
  },
})

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

const isProduction = NODE_ENV === 'production'

const upload = multer({
  storage: isProduction ? uploadS3 : multerStorage,
  fileFilter: multerFilter,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
})

const uploadFile = upload.single('file')

const processImage = catchAsync(async (req, res, next) => {
  if (!req.file) return next(new AppError('No file uploaded', 400))

  const {originalname, mimetype, size, filename, path, location} = req.file
  const url = isProduction ? location : `${BASE_URL}/uploads/${filename}`

  const file = await File.create({
    filename: originalname,
    mimeType: mimetype,
    size,
    url,
    path,
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
