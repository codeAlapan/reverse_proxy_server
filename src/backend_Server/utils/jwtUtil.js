const jwt = require('jsonwebtoken');
const SECRET_KEY = 'my_secret_key';

const verifyToken = async (token) => await jwt.verify(token, SECRET_KEY);

const generateToken = async (payload) =>
  await jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });


module.exports = {verifyToken,generateToken};