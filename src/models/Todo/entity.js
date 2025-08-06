const {DataTypes} = require('sequelize')
const sequelize = require('../../config/db')
const {User} = require('../User')

const Todo = sequelize.define(
  'Todo',
  {
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
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: {args: [0], msg: 'Order must be a non-negative integer.'},
      },
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
      allowNull: false,
      defaultValue: false,
    },
    dueDateNotificationSent: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    doneAt: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {isDate: {msg: 'doneAt must be a valid date.'}},
    },
  },
  {
    hooks: {
      beforeCreate: async todo => {
        const maxOrder = await Todo.max('order', {
          where: {userId: todo.userId},
        })
        todo.order = (maxOrder || 0) + 1
      },
      beforeDestroy: async todo => {
        await Todo.update(
          {order: sequelize.literal('`order` - 1')},
          {
            where: {
              userId: todo.userId,
              order: {[sequelize.Op.gt]: todo.order},
            },
          }
        )
      },
    },
  }
)

Todo.reorderTodos = async function (userId, todoIds) {
  const transaction = await sequelize.transaction()

  try {
    for (let i = 0; i < todoIds.length; i++) {
      await Todo.update(
        {order: i + 1},
        {
          where: {
            id: todoIds[i],
            userId: userId,
          },
          transaction,
        }
      )
    }

    await transaction.commit()
    return true
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}

Todo.belongsTo(User, {
  foreignKey: {
    name: 'userId',
    type: DataTypes.UUID,
  },
  as: 'userDetails',
  onDelete: 'CASCADE',
})

module.exports = Todo
