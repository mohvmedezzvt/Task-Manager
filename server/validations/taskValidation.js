const Joi = require('joi');

const validateTask = (task) => {
  const schema = Joi.object({
    name: Joi.string().max(20).required(),
    assignedTo: Joi.string().required(),
    status: Joi.string().valid('Pending', 'In Progress', 'Completed').required(),
    dueDate: Joi.date(),
  });

  return schema.validate(task);
};

const validateTaskUpdate = (task) => {
  const schema = Joi.object({
    name: Joi.string().trim().max(20),
    assignedTo: Joi.string(),
    status: Joi.string().valid('Pending', 'In Progress', 'Completed'),
    dueDate: Joi.date(),
  });

  return schema.validate(task);
};

module.exports = {
  validateTask,
  validateTaskUpdate
};
