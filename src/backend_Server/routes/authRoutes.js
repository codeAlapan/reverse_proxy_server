const express = require('express');
const { generateToken } = require('../utils/jwtUtil');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ message: 'Username is required' });
    }

    const token = await generateToken({ username });

    res
      .cookie('token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
      })
      .json({ message: 'Login successful' });
  } catch (err) {
    res.status(400).send('Error: ' + err.message);
  }
});

//* Protected route
router.get('/protected', authMiddleware, (req, res) => {
  try {
    res.json({ message: `Hello, ${req.user.username}! You are authorized.` });
  } catch (err) {
    res.status(400).send('Error: ' + err.message);
  }
});

module.exports = router;
