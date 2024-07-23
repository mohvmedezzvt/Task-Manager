const Project = require('../models/Project');
const Task = require('../models/Task');
const asyncHandler = require('express-async-handler');
const { validateProject } = require('../validations/projectValidation');
const User = require('../models/User');

/**
 * @desc    Get all projects for the user
 * @route   GET /api/v1/projects
 * @access  Private
 */
exports.getAllProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({ members: req.user._id })
                                .populate('createdBy', 'username email')
                                .populate('members', 'username email')
                                .populate({
                                  path: 'tasks',
                                  select: 'name description status dueDate',
                                  populate: {
                                    path: 'assignedTo',
                                    select: 'username email'
                                  }
                                })
                                .exec();

  if (!projects.length) return res.status(404).json({ message: 'No projects found' });
  res.status(200).json({ projects });
});

/**
 * @desc    Get a project by id
 * @route   GET /api/v1/projects/:projectId
 * @access  Private
 */
exports.getProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.projectId)
                                .populate('createdBy', 'username email')
                                .populate('members', 'username email')
                                .populate({
                                  path: 'tasks',
                                  select: 'name description status dueDate',
                                  populate: {
                                    path: 'assignedTo',
                                    select: 'username email'
                                  }
                                })
                                .exec();

  if (!project) return res.status(404).json({ message: 'Project not found' });

  if (!project.members.some(member => member._id.equals(req.user._id))) {
    return res.status(403).json({ message: 'You are not authorized to view this project' });
  }

  res.status(200).json({ project });
});

/**
 * @desc    Create a new project
 * @route   POST /api/v1/projects
 * @access  Private
 */
exports.createProject = asyncHandler(async (req, res) => {
  const { error } = validateProject(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const project = new Project({
    name: req.body.name,
    description: req.body.description,
    createdBy: req.user._id,
    members: [req.user._id],
  });

  await project.save();

  await User.findByIdAndUpdate(req.user._id, { $push: { projects: project._id } });

  res.status(201).json({ project });
});

/**
 * @desc    Update a project
 * @route   PATCH /api/v1/projects/:projectId
 * @access  Private
 */
exports.updateProject = asyncHandler(async (req, res) => {
  const { error } = validateProject(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const project = await Project.findById(req.params.projectId);
  if (!project) return res.status(404).json({ message: 'Project not found' });

  if (project.createdBy.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'You are not authorized to update this project' });
  }

  project.name = req.body.name !== undefined ? req.body.name : project.name;
  project.description = req.body.description !== undefined ? req.body.description : project.description;

  await project.save();
  res.status(200).json({ project });
});

/**
 * @desc    Delete a project
 * @route   DELETE /api/v1/projects/:projectId
 * @access  Private
 */
exports.deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.projectId);
  if (!project) return res.status(404).json({ message: 'Project not found' });

  if (project.createdBy.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'You are not authorized to delete this project' });
  }

  await Task.deleteMany({ project: req.params.projectId });
  await Project.findByIdAndDelete(req.params.projectId);

  res.status(200).json({ message: 'Project deleted successfully' });
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
