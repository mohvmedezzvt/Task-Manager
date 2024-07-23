const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} = require('../controllers/notificationController');

// /api/v1/notifications
router.route('/')
      .get(auth, getNotifications);

// /api/v1/notifications/:notificationId/read
router.route('/:notificationId/read')
      .patch(auth, markAsRead);

// /api/v1/notifications/read
router.route('/read')
      .patch(auth, markAllAsRead);

// /api/v1/notifications/:notificationId
router.route('/:notificationId')
      .delete(auth, deleteNotification);

module.exports = router;
