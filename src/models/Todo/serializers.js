const serializer = todo => ({
  id: todo.id,
  title: todo.title,
  note: todo.note,
  isCompleted: todo.isCompleted,
  isImportant: todo.isImportant,
  order: todo.order,
  doneAt: todo.doneAt,
  dueDate: todo.dueDate,
  createdAt: todo.createdAt,
})

module.exports = serializer
