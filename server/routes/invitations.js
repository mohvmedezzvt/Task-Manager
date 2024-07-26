const express = require('express');
const auth = require('../middlewares/auth');
const {
  getInvitations,
  respondToInvitation,
} = require('../controllers/invitationController');

const router = express.Router();

// /api/v1/invitations
router.route('/')
      .get(auth, getInvitations);

// /api/v1/invitations/:invitationId
router.route('/:invitationId')
      .patch(auth, respondToInvitation);

module.exports = router;
