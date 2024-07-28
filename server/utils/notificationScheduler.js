const cron = require('node-cron');
const Task = require('../models/Task');
const Notification = require('../models/Notification');
const moment = require('moment');
const asyncHandler = require('express-async-handler');

// Schedule the cron job to run every day at 12:00 AM
cron.schedule('0 0 * * *', asyncHandler(async () => {
  const now = moment();
  const tomorrow = moment().add(1, 'days');

  const tasks = await Task.find({
    dueDate: {
      $gte: now.toDate(),
      $lt: tomorrow.toDate(),
    },
    status: 'pending',
    }).populate('assignedTo', 'username email');

  for (const task of tasks) {
    const notification = new Notification({
      message: `Reminder: Task '${task.name}' is due tomorrow`,
      user: task.assignedTo._id,
    });

    await notification.save();
  }
}));
