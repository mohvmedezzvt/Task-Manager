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


router.route('/')
      .get(auth, getAllTasks)
      .post(auth, createTask);

router.route('/:id')
      .get(auth, getTask)
      .patch(auth, updateTask)
      .delete(auth, deleteTask);

module.exports = router;
