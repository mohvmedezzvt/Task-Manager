const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { getNotifications, markAsRead } = require('../controllers/notificationController');

router.route('/')
      .get(auth, getNotifications);

router.route('/:id/read')
      .patch(auth, markAsRead);

module.exports = router;
