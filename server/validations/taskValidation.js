const Joi = require('joi');

const validateTask = (task) => {
  const schema = Joi.object({
    name: Joi.string().max(20).required(),
    assignedTo: Joi.string().required(),
    completed: Joi.boolean(),
  });

  return schema.validate(task);
};

const validateTaskUpdate = (task) => {
  const schema = Joi.object({
    name: Joi.string().max(20),
    assignedTo: Joi.string(),
    completed: Joi.boolean(),
  });

  return schema.validate(task);
};

module.exports = {
  validateTask,
  validateTaskUpdate
};
