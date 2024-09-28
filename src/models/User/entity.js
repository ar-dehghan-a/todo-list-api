const {DataTypes} = require('sequelize')
const sequelize = require('../../config/db')

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
  confirmPassword: {
    type: DataTypes.STRING,
    allowNull: true,
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

// User.beforeValidate(user => {
//   if (user.password !== user.confirmPassword) {
//     throw new AppError('رمز عبور و تکرار آن باید با هم برابر باشند', 400)
//   }
// })

// User.beforeSave(async (user, options) => {
//   if (user.changed('password')) {
//     user.password = await bcrypt.hash(user.password, 12)
//     user.confirmPassword = null
//     options.validate = false
//   }
// })

// User.beforeUpdate(async user => {
//   if (user.changed('password')) {
//     user.passwordChangedAt = Date.now() - 1000
//   }
// })

// User.prototype.correctPassword = async (candidatePassword, userPassword) =>
//   bcrypt.compareSync(candidatePassword, userPassword)

// User.prototype.changedPasswordAfter = (user, JWTTimestamp) => {
//   if (user.passwordChangedAt) {
//     const changedTimestamp = parseInt(user.passwordChangedAt.getTime() / 1000, 10)
//     return JWTTimestamp < changedTimestamp
//   }

//   return false
// }

// User.prototype.createPasswordResetToken = async user => {
//   const resetToken = crypto.randomBytes(32).toString('hex')

//   await user.update(
//     {
//       passwordResetToken: crypto.createHash('sha256').update(resetToken).digest('hex'),
//       passwordResetExpires: Date.now() + 10 * 60 * 1000,
//     },
//     {
//       validate: false,
//     }
//   )

//   return resetToken
// }

module.exports = User
