const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// --- GET USER BY ID ---
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.status(500).send('Server error');
  }
});

// --- SEARCH FOR USERS ---
router.get('/', async (req, res) => {
  const query = req.query.search;
  
  if (!query) {
    return res.json([]);
  }
  try {
    const users = await User.find({
      name: { $regex: query, $options: 'i' }
    }).select('-password');
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// --- UPDATE USER PROFILE (NAME, BIO, HEADLINE) ---
router.put('/profile', auth, async (req, res) => {
  const { name, bio, headline } = req.body; // 👈 Add 'headline'

  const profileFields = {};
  if (name) profileFields.name = name;
  if (bio || bio === "") profileFields.bio = bio;
  if (headline || headline === "") profileFields.headline = headline; // 👈 Add this line

  try {
    let user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: profileFields },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;