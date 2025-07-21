const rateLimit = require('express-rate-limit');

const rateLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minutes
    max: 10, // max 100 requests per IP
    message: 'Too many requests from this IP, please try again after 1 minutes',
    standardHeaders: true,
    legacyHeaders: false,
  });
  
  module.exports = rateLimiter;