const Notification = require('../models/Notification');
const asyncHandler = require('express-async-handler');

/**
 * @description Get all notifications for the user
 * @route GET /api/v1/notifications
 * @access Private
 */
exports.getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.status(200).json({ notifications });
});

/**
 * @description Mark a notification as read
 * @route PATCH /api/v1/notifications/:notificationId/read
 * @access Private
 */
exports.markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.notificationId);
  if (!notification) return res.status(404).json({ message: 'Notification not found' });

  if (notification.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'You are not authorized to mark this notification as read' });
  }

  if (notification.read) {
    return res.status(400).json({ message: 'Notification is already marked as read' });
  }

  notification.read = true;
  await notification.save();
  res.status(200).json({ message: 'Notification marked as read' });
});

/**
 * @description Mark all notifications as read
 * @route PATCH /api/v1/notifications/read
 * @access Private
 */
exports.markAllAsRead = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id });
  if (!notifications.length) return res.status(404).json({ message: 'No notifications found' });

  if (notifications.every(notification => notification.read)) {
    return res.status(400).json({ message: 'All notifications are already marked as read' });
  }

  await Notification.updateMany({ user: req.user._id }, { read: true });
  res.status(200).json({ message: 'All notifications marked as read' });
});

/**
 * @description Delete a notification
 * @route DELETE /api/v1/notifications/:notificationId
 * @access Private
 */
exports.deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.notificationId);
  if (!notification) return res.status(404).json({ message: 'Notification not found' });

  if (notification.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'You are not authorized to delete this notification' });
  }

  await Notification.findByIdAndDelete(req.params.notificationId);
  res.status(200).json({ message: 'Notification deleted successfully' });
});
