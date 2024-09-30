const serializer = user => ({
  id: user.id,
  name: user.name,
  email: user.email,
  photo: user.photo,
  role: user.role,
  createdAt: user.createdAt,
})

module.exports = serializer
