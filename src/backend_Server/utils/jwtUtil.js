const jwt = require('jsonwebtoken');

// Generate Token - Promise wrapper
const generateToken = async (payload) => {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) {
        reject(err); // this can be caught in a try-catch
      } else {
        resolve(token);
      }
    });
  });
};

// Verify Token - Promise wrapper
const verifyToken = async (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
};

module.exports = { generateToken, verifyToken };
