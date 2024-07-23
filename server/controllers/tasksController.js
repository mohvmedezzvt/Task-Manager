const Task = require('../models/Task');
const Project = require('../models/Project');
const Notification = require('../models/Notification');
const asyncHandler = require('express-async-handler');
const { validateTask, validateTaskUpdate } = require('../validations/taskValidation');

/**
 * @description Get all tasks for the user
 * @route GET /api/v1/projects/:projectId/tasks
 * @access Private
 */
exports.getAllTasks = asyncHandler ( async (req, res) => {
  const tasks = await Task.find({ createdBy: req.user._id })
                          .populate('assignedTo', 'username email')
                          .exec();

  if (!tasks.length) return res.status(404).json({ message: 'No tasks found' });
  res.status(200).json({ tasks });
});

/**
 * @description Get a single task by ID
 * @route GET /api/v1/projects/:projectId/tasks/:taskId
 * @access Private
 */
exports.getTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.taskId)
                         .populate('assignedTo', 'username email')
                         .exec();

  if (!task) return res.status(404).json({ message: 'Task not found' });

  res.status(200).json({ task });
});

/**
 * @description Create a new task and assign it to a project
 * @route POST /api/v1/projects/:projectId/tasks
 * @access Private
 */
exports.createTask = asyncHandler(async (req, res) => {
  const { error } = validateTask(req.body);
  if (error) return res.status(400).json({ msg: error.details[0].message });

  const { name, description, status, dueDate, assignedTo } = req.body;

  const project = await Project.findById(req.params.projectId);
  if (!project) return res.status(404).json({ message: `No project with id: ${req.params.projectId}` });

  const task = new Task({
    name,
    description,
    status,
    dueDate,
    createdBy: req.user._id,
    assignedTo,
    project: req.params.projectId,
  });

  await task.save();

  project.tasks.push(task._id);
  await project.save();

  if (assignedTo) {
    const notification = new Notification({
      user: assignedTo,
      message: `You have been assigned a new task: ${name}`,
    });
    await notification.save();
  }

  res.status(201).json({ task });
});

/**
 * @description Update a task by ID
 * @route PATCH /api/v1/projects/:projectId/tasks/:taskId
 * @access Private
 */
exports.updateTask = asyncHandler(async (req, res) => {
  const { error } = validateTaskUpdate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const task = await Task.findById(req.params.taskId);
  if (!task) return res.status(404).json({ message: `No task with id: ${req.params.taskId}` });

  task.name = req.body.name !== undefined ? req.body.name : task.name;
  task.description = req.body.description !== undefined ? req.body.description : task.description;
  task.status = req.body.status !== undefined ? req.body.status : task.status;
  task.dueDate = req.body.dueDate !== undefined ? req.body.dueDate : task.dueDate;
  task.assignedTo = req.body.assignedTo !== undefined ? req.body.assignedTo : task.assignedTo;

  await task.save();
  res.status(200).json({ task });
});

/**
 * @description Delete task by ID
 * @route DELETE /api/v1/projects/:projectId/tasks/:taskId
 * @access Private
 */
exports.deleteTask = asyncHandler ( async (req, res) => {
  const task = await Task.findById(req.params.taskId);
  if (!task) return res.status(404).json({ message: `No task with id: ${req.params.taskId}` });

  await Task.findByIdAndDelete(req.params.taskId);

  const project = await Project.findById(req.params.projectId);
  project.tasks = project.tasks.filter(taskId => taskId.toString() !== req.params.taskId);
  await project.save();

  res.status(200).json({ message: 'Task deleted successfully' });
});
