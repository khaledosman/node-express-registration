// external libraries
const express = require('express')
const bodyParser = require('body-parser')
require('dotenv').config()
const app = express()
const mongoose = require('mongoose')
const apiControllers = require('./api')
// setup middlewars
const MONGO_URL = process.env.MONGO_URL
app.use(bodyParser.json())
app.use('/', apiControllers)
mongoose.connect(MONGO_URL)
  .then(() => {
    console.log('mongo connected')
    // start the server
    app.listen(process.env.PORT, () => {
      console.log('listening to connections on port: ' + process.env.PORT)
    })
  })

process.on('SIGTERM', () => {
  console.info('SIGTERM signal received.')
  console.log('Closing http server.')
  app.close(() => {
    console.log('Http server closed.')
    mongoose.connection.close(false, () => {
      console.log('MongoDb connection closed.')
      process.exit(0)
    })
  })
})
