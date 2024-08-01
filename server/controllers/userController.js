const User = require('../models/User');
const InvalidToken = require('../models/InvalidToken');
const asyncHandler = require('express-async-handler');
const { validateUpdate } = require('../validations/userValidation');

/**
 * @desc    Get current user profile
 * @route   GET /api/v1/users/me
 * @access  Private
 */
exports.getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password')
                                                .populate({
                                                  path: 'projects',
                                                  select: 'name',
                                                });

  if (!user) return res.status(404).json({ message: 'User not found' });

  res.status(200).json({ user });
});

/**
 * @desc    Update user profile
 * @route   PATCH /api/v1/users/me
 * @access  Private
 */
exports.updateUser = asyncHandler(async (req, res) => {
  const { error } = validateUpdate(req.body)
  if (error) return res.status(400).json({ message: error.details[0].message });

  if (req.body.email) return res.status(400).json({ message: 'Email cannot be updated' });

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        username: req.body.username,
        bio: req.body.bio,
      }
    }, { new: true, runValidators: true }
  ).select('-password');

  if (!user) return res.status(404).json({ message: 'User not found' });

  res.status(200).json(user);
});

/**
 * @desc    Delete user profile
 * @route   DELETE /api/v1/users/me
 * @access  Private
 */
exports.deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const token = req.header('Authorization')?.split(' ')[1];
  const invalidToken = new InvalidToken({
    token,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });
  await invalidToken.save();

  await user.deleteOne();

  res.status(200).json({ message: 'User deleted successfully' });
});
