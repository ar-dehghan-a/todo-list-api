const fs = require('fs')
const path = require('path')
const multer = require('multer')
const {S3} = require('@aws-sdk/client-s3')
const multerS3 = require('multer-s3')
const AppError = require('../utils/appError')
const catchAsync = require('../utils/catchAsync')
const {File, serializer} = require('../models/File')

const {NODE_ENV, BASE_URL, LIARA_ENDPOINT, LIARA_BUCKET_NAME, LIARA_ACCESS_KEY, LIARA_SECRET_KEY} =
  process.env

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../public/uploads')
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, {recursive: true})
    cb(null, 'public/uploads')
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1]
    cb(null, `${file.fieldname}-${Date.now()}.${ext}`)
  },
})

const hasLiaraConfig = LIARA_ENDPOINT && LIARA_BUCKET_NAME && LIARA_ACCESS_KEY && LIARA_SECRET_KEY
let uploadS3 = null
let s3 = null
if (hasLiaraConfig) {
  const config = {
    endpoint: LIARA_ENDPOINT,
    region: 'default',
    credentials: {
      accessKeyId: LIARA_ACCESS_KEY,
      secretAccessKey: LIARA_SECRET_KEY,
    },
  }
  s3 = new S3(config)
  uploadS3 = multerS3({
    s3,
    bucket: LIARA_BUCKET_NAME,
    key: function (req, file, cb) {
      const ext = file.mimetype.split('/')[1]
      cb(null, `${file.fieldname}-${Date.now()}.${ext}`)
    },
  })
}
const useS3 = NODE_ENV === 'production' && hasLiaraConfig

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
  storage: useS3 ? uploadS3 : multerStorage,
  fileFilter: multerFilter,
  limits: {fileSize: 1024 * 1024 * 5},
})

const uploadFile = upload.single('file')

const processImage = catchAsync(async (req, res, next) => {
  if (!req.file) return next(new AppError('No file uploaded', 400))

  const {originalname, mimetype, size, filename, path, location} = req.file
  const url = useS3 ? location : `${BASE_URL}/uploads/${filename}`

  const file = await File.create({
    filename: originalname,
    type: mimetype,
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
