const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: String,
  nuid: String,
  email: String,
})

module.exports = mongoose.model('user', userSchema)
