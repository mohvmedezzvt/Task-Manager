const Task = require('../models/Task');
const asyncHandler = require('express-async-handler');
const { validateTask, validateTaskUpdate } = require('../validations/taskValidation');

/**
 * @description Get all tasks
 * @route GET /api/v1/tasks
 * @access Public
 */
const getAllTasks = asyncHandler ( async (req, res) => {
  const tasks = await Task.find({});
  res.status(200).json({ tasks, amount: tasks.length });
});

/**
 * @description Create a task
 * @route POST /api/v1/tasks
 * @access Private
 */
const createTask = asyncHandler(async (req, res) => {
  const { error } = validateTask(req.body);
  if (error) return res.status(400).json({ msg: error.details[0].message });

  const task = await Task.create(req.body);
  res.status(201).json({ task });
});

/**
 * @description Get single task
 * @route GET /api/v1/tasks/:id
 * @access Public
 */
const getTask = asyncHandler(async (req, res) => {
  const { id: taskID } = req.params;
  const task = await Task.findOne({ _id: taskID });
  if (!task) return res.status(404).json({ msg: `No task with id: ${taskID}` });

  res.status(200).json({ task });
});

/**
 * @description Update task
 * @route PATCH /api/v1/tasks/:id
 * @access Public
 */
const updateTask = asyncHandler(async (req, res) => {
  const { error } = validateTaskUpdate(req.body);
  if (error) return res.status(400).json({ msg: error.details[0].message });

  const { id: taskID } = req.params;
  const task = await Task.findOneAndUpdate({ _id: taskID }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!task) return res.status(404).json({ msg: `No task with id: ${taskID}` });

  res.status(200).json({ task });
});

/**
 * @description Delete task
 * @route DELETE /api/v1/tasks/:id
 * @access Public
 */
const deleteTask = asyncHandler ( async (req, res) => {
  const { id: taskID } = req.params;
  const task = await Task.findOneAndDelete({ _id: taskID });
  if (!task) return res.status(404).json({ msg: `No task with id: ${taskID}` });

  res.status(200).json('Task deleted successfully');
});

module.exports = {
  getAllTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
};
