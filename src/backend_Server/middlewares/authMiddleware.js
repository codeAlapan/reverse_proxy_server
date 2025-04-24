const {verifyToken} = require('../utils/jwtUtil')
const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    const decodedObj =await verifyToken(token);
    req.user = decodedObj;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;
