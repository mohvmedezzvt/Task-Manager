const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const authorize = require('../middlewares/authorize');
const {
  getAllTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
} = require('../controllers/tasksController');


router.route('/')
      .get(auth, authorize(['admin', 'user']), getAllTasks)
      .post(auth, authorize(['admin', 'user']), createTask);

router.route('/:id')
      .get(auth, getTask)
      .patch(auth, authorize(['admin', 'user']), updateTask)
      .delete(auth, authorize(['admin']), deleteTask);

module.exports = router;
