const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const {
  getCurrentUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController');

// /api/v1/users/me
router.route('/me')
      .get(auth, getCurrentUser)
      .patch(auth, updateUser)
      .delete(auth, deleteUser);

module.exports = router;
