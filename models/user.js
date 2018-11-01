const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
  username: String,
  email: String,
  verificationToken: String,
  isVerified: Boolean

})

const User = mongoose.model('User', UserSchema, 'users')
module.exports.User = User
