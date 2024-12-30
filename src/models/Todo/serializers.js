const serializer = todo => ({
  id: todo.id,
  title: todo.title,
  note: todo.note,
  isCompleted: todo.isCompleted,
  isImportant: todo.isImportant,
  doneAt: todo.doneAt,
  createdAt: todo.createdAt,
})

module.exports = serializer
