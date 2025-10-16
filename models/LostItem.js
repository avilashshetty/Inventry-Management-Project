// models/LostItem.js
const mongoose = require('mongoose');
const lostItemSchema = new mongoose.Schema({
  id: String, // <-- add this line
  name: String,
  category: String,
  location: String,
  date: Date,
  image: String,
  contact: String // <-- add this line if not present
});
module.exports = mongoose.model('LostItem', lostItemSchema);
