const express = require('express');
const path = require('path');
const router = express.Router();

// Serve static HTML pages
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'try1.html'));
});

router.get('/track', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'track1.html'));
});
router.get('/track', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'lost1.html'));
});
router.get('/track', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'submit1.html'));
});


module.exports = router;
