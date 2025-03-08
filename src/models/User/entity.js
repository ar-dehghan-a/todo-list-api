const {DataTypes} = require('sequelize')
const sequelize = require('../../config/db')

// Constants
const NAME_MIN_LENGTH = 2
const NAME_MAX_LENGTH = 150
const PASSWORD_MIN_LENGTH = 8
const PASSWORD_MAX_LENGTH = 100
const EMAIL_MAX_LENGTH = 255

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
    comment: 'Unique identifier for the user',
  },
  name: {
    type: DataTypes.STRING(NAME_MAX_LENGTH),
    allowNull: false,
    validate: {
      notEmpty: {msg: 'Name cannot be empty'},
      notNull: {msg: 'Name is required'},
      len: {
        args: [NAME_MIN_LENGTH, NAME_MAX_LENGTH],
        msg: `Name must be between ${NAME_MIN_LENGTH} and ${NAME_MAX_LENGTH} characters long`,
      },
    },
  },
  surname: {
    type: DataTypes.STRING(NAME_MAX_LENGTH),
    allowNull: false,
    validate: {
      notEmpty: {msg: 'Surname cannot be empty'},
      notNull: {msg: 'Surname is required'},
      len: {
        args: [NAME_MIN_LENGTH, NAME_MAX_LENGTH],
        msg: `Surname must be between ${NAME_MIN_LENGTH} and ${NAME_MAX_LENGTH} characters long`,
      },
    },
    comment: "User's last name",
  },
  email: {
    type: DataTypes.STRING(EMAIL_MAX_LENGTH),
    unique: {msg: 'Email must be unique'},
    allowNull: false,
    validate: {
      isEmail: {msg: 'Invalid email address'},
      notNull: {msg: 'Email is required'},
      isLowercase: true,
    },
    comment: "User's email address",
  },
  password: {
    type: DataTypes.STRING(PASSWORD_MAX_LENGTH),
    allowNull: false,
    validate: {
      len: {
        args: [PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH],
        msg: `Password must be between ${PASSWORD_MIN_LENGTH} and ${PASSWORD_MAX_LENGTH} characters long`,
      },
      notNull: {msg: 'Password is required'},
    },
    comment: 'Hashed password',
  },
  photo: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: "URL to user's profile photo",
  },
  role: {
    type: DataTypes.ENUM('admin', 'user'),
    defaultValue: 'user',
    allowNull: false,
    validate: {
      isIn: {
        args: [['admin', 'user']],
        msg: 'Role must be either admin or user',
      },
    },
    comment: "User's role in the system",
  },
  passwordChangedAt: DataTypes.DATE,
  passwordResetToken: DataTypes.STRING,
  passwordResetExpires: DataTypes.DATE,
})

User.beforeUpdate(async user => {
  if (user.changed('password')) user.passwordChangedAt = Date.now() - 1000
})

module.exports = User
