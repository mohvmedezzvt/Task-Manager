const User = require('../models/User');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const {
  validateUser,
  validateLogin,
} = require('../validations/userValidation');

/**
 * @desc    Register a new user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
exports.register = asyncHandler(async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).json({ message: 'User already exists' });

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  user = new User({
    username: req.body.username,
    email: req.body.email,
    bio: req.body.bio,
    password: hashedPassword,
  });

  await user.save();
  const token = user.generateAuthToken();

  res.status(201).header('x-auth-token', token).json({ _id: user._id, username: user.username, email: user.email });
});

/**
 * @desc    Login user
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
exports.login = asyncHandler(async (req, res) => {
  const { error } = validateLogin(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).json({ message: 'Invalid credentials' });

  const token = user.generateAuthToken();
  res.status(200).json({ token });
});

/**
 * @desc    Request password reset
 * @route   POST /api/v1/auth/forgot-password
 * @access  Public
 */
exports.requestPasswordReset = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/reset-password/${resetToken}`;

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password Reset',
      message,
    });

    console.log('Reset password email sent to ' + user.email);
    res.status(200).json({ message: 'Email sent' });
  } catch (error) {
    console.log('Error sending email: ', error);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return res.status(500).json({ message: 'Email could not be sent' });
  }
});

/**
 * @desc    Reset password
 * @route   PATCH /api/v1/auth/reset-password/:resetToken
 * @access  Public
 */
exports.resetPassword = asyncHandler(async (req, res) => {
  const resetPasswordToken = crypto.createHash('sha256').update(req.params.resetToken).digest('hex');
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

  const { error } = validateResetPassword(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  res.status(200).json({ message: 'Password updated' });
});
