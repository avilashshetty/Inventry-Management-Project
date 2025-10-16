// models/LostItem.js
const mongoose = require('mongoose');
const submitItemSchema = new mongoose.Schema({
  id: String,           // <-- added
  name: String,
  category: String,
  location: String,
  date: Date,
  image: String,
  contact: String       // <-- added
});
module.exports = mongoose.model('Submititem', submitItemSchema);
