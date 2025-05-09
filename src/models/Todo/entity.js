const {DataTypes} = require('sequelize')
const sequelize = require('../../config/db')
const {User} = require('../User')

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
  dueDate: {
    type: DataTypes.DATE,
    allowNull: true,
    validate: {
      isDate: {msg: 'dueDate must be a valid date.'},
    },
  },
  dayBeforeNotificationSent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  dueDateNotificationSent: {
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

Todo.belongsTo(User, {
  foreignKey: {
    name: 'userId',
    type: DataTypes.UUID,
  },
  as: 'userDetails',
  onDelete: 'CASCADE',
})

module.exports = Todo
