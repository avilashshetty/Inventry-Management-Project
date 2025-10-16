const express = require('express');
const router = express.Router();
const LostItem = require('../models/LostItem');
const Submititem = require('../models/Submititem');
const Claim = require('../models/Claim');
const User = require('../models/User');

// POST lost item
router.post('/lost', async (req, res) => {
  try {
    const { name, category, location, date, image, contact } = req.body;
    const id = 'LST' + Math.floor(1000 + Math.random() * 9000);
    const newLostItem = new LostItem({ id, name, category, location, date, image, contact });
    await newLostItem.save();
    res.json({ success: true, id: newLostItem.id });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST found item
router.post('/found', async (req, res) => {
  try {
    const { name, category, location, date, image, contact } = req.body;
    const id = 'FND' + Math.floor(1000 + Math.random() * 9000);
    const newFoundItem = new Submititem({ id, name, category, location, date, image, contact });
    await newFoundItem.save();
    res.json({ success: true, id });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST claim item
router.post('/claim', async (req, res) => {
  try {
    const { name, category, location, date, image, contact } = req.body;
    const id = 'CLM' + Math.floor(1000 + Math.random() * 9000);
    const newClaim = new Claim({ id, name, category, location, date, image, contact });
    await newClaim.save();
    res.json({ success: true, id });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST register user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, contact } = req.body;

    // Check for existing user to avoid duplicates (optional but recommended)
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, error: 'Email already registered' });
    }

    const id = 'USR' + Math.floor(1000 + Math.random() * 9000);
    const newUser = new User({ id, name, email, password, contact });
    await newUser.save();
    res.json({ success: true, id });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
// POST login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    // Find user by email and password
    const user = await User.findOne({ email, password });
    if (user) {
      // Don't return password in response!
      res.json({ success: true, user: {
        name: user.name,
        email: user.email,
        contact: user.contact,
        id: user.id
      }});
    } else {
      res.json({ success: false, error: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});


// POST login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Note: For production, hash passwords with bcrypt and compare hashes!
    const user = await User.findOne({ email, password });

    if (user) {
      res.json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          contact: user.contact
        }
      });
    } else {
      res.json({ success: false, error: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET lost items
router.get('/lost', async (req, res) => {
  try {
    const items = await LostItem.find().sort({ date: -1 });
    res.json({ success: true, items });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET found items
router.get('/found', async (req, res) => {
  try {
    const items = await Submititem.find().sort({ date: -1 });
    res.json({ success: true, items });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
