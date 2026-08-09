const jwt = require('jsonwebtoken');
const config = require('../config/config');

/**
 * Generate a short-lived access token
 */
const generateAccessToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );
};

/**
 * Generate a long-lived refresh token
 */
const generateRefreshToken = (userId) => {
  return jwt.sign(
    { id: userId },
    config.jwt.refreshSecret,
    { expiresIn: config.jwt.refreshExpiresIn }
  );
};

/**
 * Verify a refresh token
 */
const verifyRefreshToken = (token) => {
  return jwt.verify(token, config.jwt.refreshSecret);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
};
