require('express-async-errors')
const path = require('path')
const express = require('express')
const config = require('./utils/config')
const mongoose = require('mongoose')
const cors = require('cors')
const middleware = require('./utils/middleware')
const { log, error } = require('./utils/logger')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const testingRouter = require('./controllers/testing')

const startMongoose = async () => {
  try {
    await mongoose.connect(config.MONGODB_URL)
    log('Connected to Mongoose')

  } catch (e) {
    error('Error connecting to Mongoose:', e)
  }
}
startMongoose()
mongoose.set('strictQuery', false)

const app = express()
app.use(cors())
app.use(express.json())
app.use(middleware.tokenExtractor)
if (process.env.NODE_ENV !=='test') {
  app.use(middleware.morganLogger())
  if (process.env.NODE_ENV === 'production')
  {
    app.use(express.static('./dist'))
  }
}
else
{
  app.use('/api/testing', testingRouter)
}
app.get('/health', (req, res) => {
  res.send('ok')
})
app.use('/api/blogs', middleware.userExtractor, blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, './dist/index.html'))
} )
app.use(middleware.badRequestHandler)
app.use(middleware.errorHandler)

module.exports = app