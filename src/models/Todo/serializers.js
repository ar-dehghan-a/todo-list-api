const serializer = todo => ({
  id: todo.id,
  title: todo.title,
  description: todo.description,
  isCompleted: todo.isCompleted,
  isImportant: todo.isImportant,
  doneAt: todo.doneAt,
  createdAt: todo.createdAt,
})

module.exports = serializer
