const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: [3, 'Project name must be at least 3 characters long'],
    maxlength: [50, 'Project name must not exceed 50 characters'],
  },
  description: {
    type: String,
    maxlength: [500, 'Description must not exceed 500 characters'],
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  tasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
  }],
  completed: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
