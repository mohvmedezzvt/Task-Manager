const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const {
  getAllProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  addTaskToProject,
} = require('../controllers/projectController');

// /api/v1/projects
router.route('/')
      .get(auth, getAllProjects)
      .post(auth, createProject);

// /api/v1/projects/:id
router.route('/:id')
      .get(auth, getProject)
      .put(auth, updateProject)
      .delete(auth, deleteProject);

// /api/v1/projects/:id/tasks
router.route('/:id/tasks')
      .post(auth, addTaskToProject);

module.exports = router;
