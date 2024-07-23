const Project = require('../models/Project');
const User = require('../models/User');
const Notification = require('../models/Notification');
const asyncHandler = require('express-async-handler');

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
 * @desc    Add a member to a project
 * @route   POST /api/v1/projects/:projectId/members
 * @access  Private
 */
exports.addMemberToProject = asyncHandler(async (req, res) => {
  const { memberId } = req.body;
  if (!memberId) return res.status(400).json({ message: 'Member ID is required' });

  const user = await User.findById(memberId);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const project = await Project.findById(req.params.projectId);
  if (!project) return res.status(404).json({ message: 'Project not found' });

  if (project.createdBy.toString() !== req.user._id.toString() && !project.members.includes(req.user._id)) {
    return res.status(403).json({ message: 'You are not authorized to add members to this project' });
  }

  if (project.members.includes(memberId)) {
    return res.status(400).json({ message: 'User is already a member of this project' });
  }

  project.members.push(memberId);
  await project.save();

  await User.findByIdAndUpdate(memberId, { $push: { projects: project._id } });

  const notification = new Notification({
    user: memberId,
    message: `You have been added to the project ${project.name}`,
  });
  await notification.save();

  res.status(200).json({ message: 'Member added to project successfully' });
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
