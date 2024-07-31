const mongoose = require('mongoose');
const Project = require('../models/Project');
const Invitation = require('../models/Invitation');
const User = require('../models/User');
const Notification = require('../models/Notification');
const asyncHandler = require('express-async-handler');

/**
 * @desc    Invite a member to a project
 * @route   POST /api/v1/projects/:projectId/invite
 * @access  Private
 */
exports.inviteMemberToProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { recipientId } = req.body;

  if (!recipientId) return res.status(400).json({ message: 'Member ID is required' });

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    return res.status(404).json({ message: 'Project not found' });
  }

  if (!mongoose.Types.ObjectId.isValid(recipientId)) {
    return res.status(404).json({ message: 'User not found' });
  }

  const project = await Project.findById(projectId);
  if (!project) return res.status(404).json({ message: 'Project not found' });

  if (project.createdBy.toString() !== req.user._id.toString() && !project.members.some(member => member._id.equals(req.user._id))) {
    return res.status(403).json({ message: 'You are not authorized to invite members to this project' });
  }

  const recipient = await User.findById(recipientId);
  if (!recipient) return res.status(404).json({ message: 'User not found' });

  if (project.members.includes(recipientId)) {
    return res.status(400).json({ message: 'User is already a member of this project' });
  }

  const existingInvitation = await Invitation.findOne({ project: projectId, recipient: recipientId });
  if (existingInvitation) {
    return res.status(400).json({ message: 'Invitation has already been sent to this user' });
  }

  const invitation = await Invitation.create({
    project: projectId,
    sender: req.user._id,
    recipient: recipientId,
  });

  await Notification.create({
    user: recipientId,
    message: `You have been invited to join the project ${project.name}`,
  });

  res.status(201).json({ message: 'Invitation sent successfully', invitation });
});

/**
 * @desc    Get all members of a project
 * @route   GET /api/v1/projects/:projectId/members
 * @access  Private
 */
exports.getProjectMembers = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.projectId)
                                .populate('members', 'username email')
                                .exec();

  if (!project) return res.status(404).json({ message: 'Project not found' });

  if (!project.members.some(member => member._id.equals(req.user._id))) {
    return res.status(403).json({ message: 'You are not authorized to view the members of this project' });
  }

  res.status(200).json({ members: project.members });
});

/**
 * @desc    Remove a member from a project
 * @route   DELETE /api/v1/projects/:projectId/members
 * @access  Private
 */
exports.removeMemberFromProject = asyncHandler(async (req, res) => {
  const { memberId } = req.body;
  if (!memberId) return res.status(400).json({ message: 'Member ID is required' });

  const user = await User.findById(memberId);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const project = await Project.findById(req.params.projectId);
  if (!project) return res.status(404).json({ message: 'Project not found' });

  if (project.createdBy.toString() !== req.user._id.toString() && !project.members.some(member => member._id.equals(req.user._id))) {
    return res.status(403).json({ message: 'You are not authorized to remove members from this project' });
  }

  if (!project.members.some(member => member.equals(memberId))) {
    return res.status(400).json({ message: 'User is not a member of this project' });
  }

  project.members = project.members.filter(member => !member.equals(memberId));
  await project.save();

  await User.findByIdAndUpdate(memberId, { $pull: { projects: req.params.projectId } });

  res.status(200).json({ message: 'Member removed from project successfully' });
});
