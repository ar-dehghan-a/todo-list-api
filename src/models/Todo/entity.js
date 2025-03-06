const {DataTypes} = require('sequelize')
const sequelize = require('../../config/db')

const Todo = sequelize.define('Todo', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING(150),
    allowNull: false,
    validate: {
      notEmpty: {msg: 'Task title cannot be empty.'},
      notNull: {msg: 'Title is required'},
    },
  },
  note: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  isCompleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  isImportant: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  doneAt: {
    type: DataTypes.DATE,
    allowNull: true,
    validate: {
      isDate: {msg: 'doneAt must be a valid date.'},
    },
  },
})

module.exports = Todo
