const Joi = require('joi');

function validateProject(project) {
  const schema = Joi.object({
    name: Joi.string().trim().min(3).max(50).required(),
    description: Joi.string().trim().max(500),
  });

  return schema.validate(project);
}

module.exports = {
  validateProject,
};
