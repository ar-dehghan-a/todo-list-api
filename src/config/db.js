const {Sequelize} = require('sequelize')

// const dev = process.env['NODE_ENV'] === 'development'
const dbType = 'postgres'

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: dbType,
  logging: false,
})

module.exports = sequelize
