const Notification = require('../models/Notification');
const asyncHandler = require('express-async-handler');

/**
 * @description Get all notifications for a user
 * @route GET /api/v1/notifications
 * @access Private
 */
exports.getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.status(200).json({ notifications, amount: notifications.length });
});

/**
 * @description Mark notification as read
 * @route PATCH /api/v1/notifications/:id/read
 * @access Private
 */
exports.markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) return res.status(404).json({ msg: 'Notification not found' });

  notification.read = true;
  await notification.save();

  res.status(200).json({ notification });
});
