const jwt = require('jsonwebtoken');

const verifyToken = async (token) => await jwt.verify(token, process.env.JWT_SECRET);

const generateToken = async (payload) =>
  await jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

  


module.exports = {verifyToken,generateToken};