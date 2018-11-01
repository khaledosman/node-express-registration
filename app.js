// external libraries
const express = require('express')
const bodyParser = require('body-parser')
require('dotenv').config()
const app = express()
const mongoose = require('mongoose')
// setup middlewars
const MONGO_URL = process.env.MONGO_URL
app.use(bodyParser.json())
app.use('/', require('./api'))
mongoose.connect(MONGO_URL)
  .then(() => {
    console.log('mongo connected')
    // start the server
    app.listen(process.env.PORT, () => {
      console.log('listening to connections on port: ' + process.env.PORT)
    })
  })
