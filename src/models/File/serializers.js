const serializer = file => ({
  id: file.id,
  filename: file.filename,
  mimeType: file.mimeType,
  url: file.url,
})

module.exports = serializer
