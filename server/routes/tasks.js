const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const {
  getAllTasks,
  createTask,
  getTask,
  updateTask,
  updateTaskPriority,
  assignTaskToProject,
  assignTaskToMember,
  deleteTask,
} = require('../controllers/tasksController');

// /api/v1/tasks
router.route('/')
      .get(auth, getAllTasks)
      .post(auth, createTask);

// /api/v1/tasks/:taskId
router.route('/:taskId')
      .get(auth, getTask)
      .patch(auth, updateTask)
      .delete(auth, deleteTask);

// /api/v1/tasks/:taskId/priority
router.route('/:taskId/priority')
      .patch(auth, updateTaskPriority);

// /api/v1/tasks/:taskId/assign
router.route('/:taskId/assign')
      .patch(auth, assignTaskToProject);

// /api/v1/tasks/:taskId/assign-to-member
router.route('/:taskId/assign-to-member')
      .patch(auth, assignTaskToMember);

module.exports = router;
