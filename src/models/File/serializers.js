const serializer = file => ({
  id: file.id,
  filename: file.filename,
  type: file.type,
  url: file.url,
})

module.exports = serializer
