const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { getNotifications, markAsRead } = require('../controllers/notificationController');

// /api/v1/notifications
router.route('/')
      .get(auth, getNotifications);

// /api/v1/notifications/:id/read
router.route('/:id/read')
      .patch(auth, markAsRead);

module.exports = router;
