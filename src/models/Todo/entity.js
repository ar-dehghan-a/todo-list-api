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
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {msg: 'Task title cannot be empty.'},
      notNull: {msg: 'Title is required'},
    },
  },
  description: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  isCompleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  isImportant: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  doneAt: DataTypes.DATE,
})

module.exports = Todo
