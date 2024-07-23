const Joi = require('joi');

const validateTask = (task) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    description: Joi.string().max(500),
    status: Joi.string().valid('pending', 'in-progress', 'completed').default('pending'),
    dueDate: Joi.date().optional(),
    assignedTo: Joi.string().optional(),
  });

  return schema.validate(task);
};

const validateTaskUpdate = (task) => {
  const schema = Joi.object({
    name: Joi.string().trim().min(3).max(50),
    description: Joi.string().trim().max(500),
    status: Joi.string().valid('pending', 'in-progress', 'completed'),
    dueDate: Joi.date().optional(),
    assignedTo: Joi.string().optional(),
  }).min(1);

  return schema.validate(task);
};

module.exports = {
  validateTask,
  validateTaskUpdate
};
