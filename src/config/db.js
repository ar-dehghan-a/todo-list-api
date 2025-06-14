const {Sequelize} = require('sequelize')

const dbType = 'postgres'
const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) throw new Error('DATABASE_URL is not defined in the environment variables.')

const sequelize = new Sequelize(databaseUrl, {
  dialect: dbType,
  logging: false,
  dialectOptions: {
    connectTimeout: 10000,
  },
})

module.exports = sequelize
