const express = require('express');
const router = express.Router();
const {
  register,
  login,
  requestPasswordReset,
  resetPassword,
} = require('../controllers/authController');

// /api/v1/auth/register
router.post('/register', register);

// /api/v1/auth/login
router.post('/login', login);

// /api/v1/auth/forgot-password
router.post('/forgot-password', requestPasswordReset);

// /api/v1/auth/reset-password/:resetToken
router.patch('/reset-password/:resetToken', resetPassword);

module.exports = router;
