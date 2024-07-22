const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const {
  getAllTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
} = require('../controllers/tasksController');

// /api/v1/tasks
router.route('/')
      .get(auth, getAllTasks)
      .post(auth, createTask);

// /api/v1/tasks/:id
router.route('/:id')
      .get(auth, getTask)
      .patch(auth, updateTask)
      .delete(auth, deleteTask);

module.exports = router;
