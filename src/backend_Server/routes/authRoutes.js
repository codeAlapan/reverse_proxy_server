const express = require('express');
const { generateToken } = require('../utils/jwtUtil');
const authMiddleware = require('../middlewares/authMiddleware');
const User = require('../models/User.js');

const router = express.Router();

router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: 'Username or email already exists' });
    }
    // hash password
    const hashPassword = await bcrypt.hash(password, 10);
    // create new user
    const newUser = new User({ username, email, password: hashPassword });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Signup failed', error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    // check if user already exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken({ id: user._id });
    res.json({ message: 'Login successful', token });
  } catch (err) {
     res.status(500).json({ message: 'Login failed', error: err.message });
  }
});

module.exports = router;
