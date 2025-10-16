const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

// Connect to MongoDB
const mongoURI = process.env.MONGO_URI || 'mongodb://mongodb:27017/lostandfound';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('DB connection error:', err));

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Import your API routes
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

// Default route to homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'try1.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
