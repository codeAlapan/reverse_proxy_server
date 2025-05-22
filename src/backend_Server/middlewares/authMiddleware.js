const {verifyToken} = require('../utils/jwtUtil')
const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    // check if token exist or not
    if(!token){
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    const decoded = await verifyToken(token);
    req.loggedInUser = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authMiddleware;
