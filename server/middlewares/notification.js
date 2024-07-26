const Notification = require('../models/Notification');
const Project = require('../models/Project');

const createTaskNotification = async (projectId, message) => {
  const project = await Project.findById(projectId).populate('members', '_id');
  const notifications = project.members.map(member => ({
    user: member._id,
    message: message,
  }));
  await Notification.insertMany(notifications);
};

module.exports = { createTaskNotification };
