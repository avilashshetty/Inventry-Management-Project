// models/LostItem.js
const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  id: String,
  name: String,
  email: String,
  password: String,
  contact: String
});
module.exports = mongoose.model('User', userSchema);
