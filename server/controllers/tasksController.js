const Task = require('../models/Task');
const Project = require('../models/Project');
const Notification = require('../models/Notification');
const asyncHandler = require('express-async-handler');
const { validateTask, validateTaskUpdate } = require('../validations/taskValidation');

const createNotification = async (userId, message) => {
  await Notification.create({ user: userId, message });
};

/**
 * @description Get all tasks for the user
 * @route GET /api/v1/tasks
 * @access Private
 */
exports.getAllTasks = asyncHandler ( async (req, res) => {
  const tasks = await Task.find({ createdBy: req.user._id })
                          .populate('assignedTo', 'username email')
                          .populate('createdBy', 'username')
                          .populate('project', 'name')
                          .exec();

  if (!tasks.length) return res.status(404).json({ msg: 'No tasks found' });
  res.status(200).json({ tasks });
});

/**
 * @description Get a single task by ID
 * @route GET /api/v1/tasks/:id
 * @access Public
 */
exports.getTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id)
                         .populate('assignedTo', 'username email')
                         .populate('project', 'name')
                         .exec();

  if (!task) return res.status(404).json({ message: 'Task not found' });
  res.status(200).json({ task });
});

/**
 * @description Create a new task
 * @route POST /api/v1/tasks
 * @access Private
 */
exports.createTask = asyncHandler(async (req, res) => {
  const { error } = validateTask(req.body);
  if (error) return res.status(400).json({ msg: error.details[0].message });

  const { name, description, status, dueDate, assignedTo, project } = req.body;

  const projectExists = await Project.findById(project);
  if (!projectExists) return res.status(404).json({ msg: `No project with id: ${project}` });

  const task = new Task({
    name,
    description,
    status,
    dueDate,
    createdBy: req.user._id,
    assignedTo,
    project,
  });

  await task.save();
  projectExists.tasks.push(task._id);
  await projectExists.save();

  if (assignedTo) {
    createNotification(assignedTo, `You have been assigned a new task: ${name}`);
  }

  res.status(201).json({ task });
});

/**
 * @description Update a task by ID
 * @route PATCH /api/v1/tasks/:id
 * @access Private
 */
exports.updateTask = asyncHandler(async (req, res) => {
  const { error } = validateTaskUpdate(req.body);
  if (error) return res.status(400).json({ msg: error.details[0].message });

  const task = await Task.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  ).populate('assignedTo', 'username email')
   .populate('project', 'name')
   .exec();

  if (!task) return res.status(404).json({ msg: `No task with id: ${req.params.id}` });

  res.status(200).json({ task });
});

/**
 * @description Delete task by ID
 * @route DELETE /api/v1/tasks/:id
 * @access Private
 */
exports.deleteTask = asyncHandler ( async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  if (!task) return res.status(404).json({ msg: `No task with id: ${req.params.id}` });

  // Remove the task from the project
  await Project.updateOne(
    { _id: task.project },
    { $pull: { tasks: task._id } }
  );

  res.status(200).json('Task deleted successfully');
});
