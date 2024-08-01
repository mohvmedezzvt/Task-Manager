const Task = require('../models/Task');
const Project = require('../models/Project');
const { createTaskNotification } = require('../middlewares/notification');
const asyncHandler = require('express-async-handler');
const { validateTask, validateTaskUpdate } = require('../validations/taskValidation');
const User = require('../models/User');

/**
 * @description Get all tasks for the user
 * @route GET /api/v1/tasks
 * @access Private
 */
exports.getAllTasks = asyncHandler ( async (req, res) => {
  const tasks = await Task.find({ createdBy: req.user._id })
                          .populate('assignedTo', 'username email')
                          .populate('project', 'name members')
                          .exec();

  if (!tasks.length) return res.status(404).json({ message: 'No tasks found' });

  const authorizedTasks = tasks.filter(task => {
    if (!task.project) return true;
    return task.project.members.some(member => member.toString() === req.user._id.toString());
  });

  if (!authorizedTasks.length) return res.status(403).json({ message: 'You are not authorized to view any tasks' });

  res.status(200).json({ tasks: authorizedTasks });
});

/**
 * @description Get a single task by ID
 * @route GET /api/v1/tasks/:taskId
 * @access Private
 */
exports.getTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.taskId)
                         .populate('assignedTo', 'username email')
                         .populate('project', 'name members')
                         .exec();

  if (!task) return res.status(404).json({ message: 'Task not found' });

  if (task.project) {
    const isMember = task.project.members.some(member => member.toString() === req.user._id.toString());
    if (!isMember) return res.status(403).json({ message: 'You are not authorized to view this task' });
  }

  res.status(200).json({ task });
});

/**
 * @description Create a new task and assign it to a project
 * @route POST /api/v1/tasks
 * @access Private
 */
exports.createTask = asyncHandler(async (req, res) => {
  const { error } = validateTask(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { name, description, status, dueDate, projectId } = req.body;

  let project = null;
  if (projectId) {
    project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: `No project with id: ${projectId}` });
  
    if (project.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You are not authorized to create a task in this project' });
    }
  }

  const task = new Task({
    name,
    description,
    status,
    dueDate,
    createdBy: req.user._id,
    project: projectId || null,
  });

  await task.save();

  if (project) {
    project.tasks.push(task._id);
    await project.save();
    await createTaskNotification(projectId, `A new task "${task.name}" has been created in the project "${project.name}"`);
  }

  res.status(201).json({ task });
});

/**
 * @description Update a task by ID
 * @route PATCH /api/v1/tasks/:taskId
 * @access Private
 */
exports.updateTask = asyncHandler(async (req, res) => {
  const { error } = validateTaskUpdate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const task = await Task.findById(req.params.taskId).populate('project');
  if (!task) return res.status(404).json({ message: `No task with id: ${req.params.taskId}` });

  if (task.createdBy.toString() !== req.user._id.toString() && (!task.assignedTo || task.assignedTo.toString() !== req.user._id.toString())) {
    return res.status(403).json({ message: 'You are not authorized to update this task' });
  }

  task.name = req.body.name !== undefined ? req.body.name : task.name;
  task.description = req.body.description !== undefined ? req.body.description : task.description;
  task.status = req.body.status !== undefined ? req.body.status : task.status;
  task.dueDate = req.body.dueDate !== undefined ? req.body.dueDate : task.dueDate;

  await task.save();

  if (task.project) {
    await createTaskNotification(task.project._id, `The task "${task.name}" has been updated in the project "${task.project.name}"`);
  }

  res.status(200).json({ task });
});

/**
 * @description Update task priority by ID
 * @route PATCH /api/v1/tasks/:taskId/priority
 * @access Private
 */
exports.updateTaskPriority = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.taskId);
  if (!task) return res.status(404).json({ message: `No task with id: ${req.params.taskId}` });

  if (task.createdBy.toString() !== req.user._id.toString() && (!task.assignedTo || task.assignedTo.toString() !== req.user._id.toString())) {
    return res.status(403).json({ message: 'You are not authorized to update the priority of this task' });
  }

  if (!['low', 'medium', 'high'].includes(req.body.priority)) {
    return res.status(400).json({ message: 'Invalid priority value' });
  }

  task.priority = req.body.priority !== undefined ? req.body.priority : task.priority;
  await task.save();

  if (task.project) {
  await createTaskNotification(task.project._id, `The priority of the task "${task.name}" has been updated in the project "${task.project.name}"`);
  }

  res.status(200).json({ task });
});

/**
 * @description Assign task to project
 * @route PATCH /api/v1/tasks/:taskId/assign
 * @access Private
 */
exports.assignTaskToProject = asyncHandler(async (req, res) => {
  const { projectId } = req.body;
  if (!projectId) return res.status(400).json({ message: 'Project ID is required' });

  const task = await Task.findById(req.params.taskId);
  if (!task) return res.status(404).json({ message: `No task with id: ${req.params.taskId}` });

  const project = await Project.findById(projectId);
  if (!project) return res.status(404).json({ message: `No project with id: ${projectId}` });

  if (project.createdBy.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'You are not authorized to assign a task to this project' });
  }

  if (project.tasks.includes(req.params.taskId)) {
    return res.status(400).json({ message: 'Task is already assigned to this project' });
  }

  task.project = project._id;
  await task.save();

  project.tasks.push(task._id);
  await project.save();

  await createTaskNotification(projectId, `The task "${task.name}" has been assigned to the project "${project.name}"`);

  res.status(200).json({ task });
});

/**
 * @description Assign a task to a project member
 * @route PATCH /api/v1/tasks/:taskId/assign-to-member
 * @access Private
 */
exports.assignTaskToMember = asyncHandler(async (req, res) => {
  const { memberId } = req.body;
  if (!memberId) return res.status(400).json({ message: 'Member ID is required' });

  const task = await Task.findById(req.params.taskId);
  if (!task) return res.status(404).json({ message: `No task with id: ${req.params.taskId}` });

  const project = await Project.findById(task.project);
  if (project === null) return res.status(400).json({ message: 'Task is not assigned to any project' });
  if (!project) return res.status(404).json({ message: `No project with id: ${task.project}` });

  if (project.createdBy.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'You are not authorized to assign a task to a project member' });
  }

  if (!project.members.includes(memberId)) {
    return res.status(400).json({ message: 'User is not a member of the project' });
  }

  const member = await User.findById(memberId);
  if (!member) return res.status(404).json({ message: `No user with id: ${memberId}` });

  task.assignedTo = memberId;
  await task.save();

  const notification = new Notification({
    user: memberId,
    message: `You have been assigned a new task: ${task.name}`,
  });
  await notification.save();

  await createTaskNotification(task.project, `The task "${task.name}" has been assigned to a ${member.username} in the project "${project.name}"`);

  res.status(200).json({ task });
});

/**
 * @description Delete task by ID
 * @route DELETE /api/v1/tasks/:taskId
 * @access Private
 */
exports.deleteTask = asyncHandler ( async (req, res) => {
  const task = await Task.findById(req.params.taskId);
  if (!task) return res.status(404).json({ message: `No task with id: ${req.params.taskId}` });

  if (task.createdBy.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'You are not authorized to delete this task' });
  }

  await Task.findByIdAndDelete(req.params.taskId);

  if (task.project) {
    const project = await Project.findById(task.project._id);
    project.tasks = project.tasks.filter(taskId => taskId.toString() !== req.params.taskId);
    await project.save();

    await createTaskNotification(task.project._id, `The task "${task.name}" has been deleted from the project "${project.name}"`);
  }

  res.status(200).json({ message: 'Task deleted successfully' });
});
