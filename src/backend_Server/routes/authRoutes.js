const express = require('express');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/login',async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ message: 'Username is required' });
    }

    const token = await jwt.sign({ username }, 'my_secret_key', { expiresIn: '1h' });

    res.cookie('token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
      }).json({ message: 'Login successful' });
  } catch (err) {
    res.status(400).send('Error: ' + err.message);
  }
});

//* Protected route
router.get('/protected', authMiddleware, (req, res) => {
  try {
    res.json({ message: 'Protected data', user: req.user });
  } catch (err) {
    res.status(400).send('Error: ' + err.message);
  }
});

module.exports = router;
