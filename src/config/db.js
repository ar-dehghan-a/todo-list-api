const {Sequelize} = require('sequelize')

const dev = process.env['NODE_ENV'] === 'development'

const dbType = 'postgres'
const host = process.env['DB_HOST']
const port = parseInt(process.env['DB_PORT'] || '5432')
const database = process.env['DB_NAME']
const username = process.env['DB_USER']
const password = process.env['DB_PASS']

const sequelize = new Sequelize(database, username, password, {
  host: host,
  port: port,
  dialect: dbType,
})

module.exports = sequelize
