const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

const mainRouter = require('./routers')

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cors())
if (process.env['NODE_ENV'] === 'development') app.use(morgan('dev'))

app.get('/', (req, res) => {
  res.send('Todo List API')
})

app.use('/api', mainRouter);

module.exports = app
