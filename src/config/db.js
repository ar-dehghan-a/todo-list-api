const {Sequelize} = require('sequelize')

const dbType = 'postgres'
const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) throw new Error('DATABASE_URL is not defined in the environment variables.')

const sequelize = new Sequelize(databaseUrl, {
  dialect: dbType,
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  pool: {
    max: 5,
    min: 0,
    idle: 10000,
    acquire: 60000,
  },
})

module.exports = sequelize
