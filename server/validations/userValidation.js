const Joi = require('joi');
const passwordComplexity = require('joi-password-complexity');

function validateUser(user) {
  const schema = Joi.object({
    username: Joi.string().trim().min(3).max(20).required(),
    email: Joi.string().trim().email().required(),
    password: passwordComplexity().required(),
  });

  return schema.validate(user);
};

function validateLogin(user) {
  const schema = Joi.object({
    email: Joi.string().trim().email().required(),
    password: Joi.string().required(),
  });

  return schema.validate(user);
};

function validateUpdate(user) {
  const schema = Joi.object({
    username: Joi.string().trim().min(3).max(20),
    email: Joi.string().trim().email(),
  });

  return schema.validate(user);
};

module.exports = {
  validateUser,
  validateLogin,
  validateUpdate,
};
