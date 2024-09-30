const {DataTypes} = require('sequelize')
const sequelize = require('../../config/db')
const {Todo} = require('../Todo')

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {msg: 'Name cannot be empty'},
      notNull: {msg: 'Name is required'},
      len: {
        args: [2, 150],
        msg: 'Name must be between 2 and 150 characters long',
      },
    },
  },
  email: {
    type: DataTypes.STRING,
    unique: {msg: 'Email must be unique'},
    allowNull: false,
    validate: {
      isEmail: {msg: 'Invalid email address'},
      notNull: {msg: 'Email is required'},
      isLowercase: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [8],
        msg: 'Password must be at least 8 characters long',
      },
      notNull: {msg: 'Password is required'},
    },
  },
  photo: DataTypes.STRING,
  role: {
    type: DataTypes.STRING,
    validate: {isIn: [['admin', 'user']]},
    defaultValue: 'user',
  },
  passwordChangedAt: DataTypes.DATE,
  passwordResetToken: DataTypes.STRING,
  passwordResetExpires: DataTypes.DATE,
})

User.beforeUpdate(async user => {
  if (user.changed('password')) user.passwordChangedAt = Date.now() - 1000
})

User.hasMany(Todo, {foreignKey: 'userId', onDelete: 'CASCADE'})
Todo.belongsTo(User, {foreignKey: 'userId', onDelete: 'CASCADE'})

module.exports = User
