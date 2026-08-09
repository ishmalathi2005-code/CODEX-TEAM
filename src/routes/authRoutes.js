const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');

// Validation rules
const registerRules = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
  body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/\d/)
    .withMessage('Password must contain at least one number'),
];

const loginRules = [
  body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

// Routes
router.post('/register', registerRules, validate, authController.register);
router.post('/login', loginRules, validate, authController.login);
router.post('/logout', protect, authController.logout);
router.post('/refresh-token', authController.refreshToken);
router.post(
  '/forgot-password',
  [body('email').isEmail().normalizeEmail()],
  validate,
  authController.forgotPassword
);
router.post(
  '/reset-password',
  [
    body('token').notEmpty().withMessage('Token is required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  ],
  validate,
  authController.resetPassword
);

module.exports = router;
