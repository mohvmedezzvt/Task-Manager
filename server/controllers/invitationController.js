const Invitation = require('../models/Invitation');
const Project = require('../models/Project');
const Notification = require('../models/Notification');
const createTaskNotification = require('../middlewares/notification');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');

/**
 * @desc    Get all invitations for the user
 * @route   GET /api/v1/invitations
 * @access  Private
 */
exports.getInvitations = asyncHandler(async (req, res) => {
  const invitations = await Invitation.find({ recipient: req.user._id })
    .populate('project', 'name description')
    .populate('sender', 'username email')
    .exec();

  res.status(200).json({ invitations });
});

/**
 * @desc    Get all invitations for the user
 * @route   GET /api/v1/invitations/:invitationId
 * @access  Private
 */
exports.respondToInvitation = asyncHandler(async (req, res) => {
  const { invitationId } = req.params;
  const { status } = req.body;

  const invitation = await Invitation.findById(invitationId);
  if (!invitation) return res.status(404).json({ message: 'Invitation not found' });

  if (invitation.recipient.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'You are not authorized to respond to this invitation' });
  }

  if (invitation.status !== 'pending') {
    return res.status(400).json({ message: 'Invitation has already been responded to' });
  }

  if (!['accepted', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  invitation.status = status;
  await invitation.save();

  if (status === 'accepted') {
    const project = await Project.findById(invitation.project);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    if (project.members.includes(invitation.recipient)) {
      return res.status(400).json({ message: 'You are already a member of this project' });
    }

    project.members.push(invitation.recipient);
    await project.save();

    await User.findByIdAndUpdate(invitation.recipient, { $push: { projects: project._id } });
  }

  await Notification.create({
    user: invitation.sender,
    message: `${invitation.recipient} has ${status} your invitation to join the project ${project.name}.`,
  });

  await createTaskNotification(invitation.project, `A new member has joined the project ${project.name}`);

  res.status(200).json({ message: `Invitation ${status}` });
});
