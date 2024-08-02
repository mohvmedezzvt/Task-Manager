const Joi = require('joi');
const passwordComplexity = require('joi-password-complexity');

const complexityOptions = {
  min: 8,
  max: 255,
  lowerCase: 1,
  upperCase: 1,
  numeric: 1,
  symbol: 1,
  requirementCount: 4,
};

function validateUser(user) {
  const schema = Joi.object({
    username: Joi.string().trim().min(3).max(20).required(),
    bio: Joi.string().max(100),
    email: Joi.string().trim().email().required(),
    password: passwordComplexity(complexityOptions).required().messages({
      "string.base": `Password should be a type of 'text'`,
      "string.empty": `Password cannot be an empty field`,
      "string.min": `Password should be at least 8 characters long`,
      "any.required": `Password is a required field`,
      "passwordComplexity": `Password must meet complexity requirements`
    }),
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

function validateResetPassword(user) {
  const schema = Joi.object({
    password: passwordComplexity(complexityOptions).required().messages({
      "string.base": `Password should be a type of 'text'`,
      "string.empty": `Password cannot be an empty field`,
      "string.min": `Password should be at least 8 characters long`,
      "any.required": `Password is a required field`,
      "passwordComplexity": `Password must meet complexity requirements`
    }),
  });

  return schema.validate(user);
};

function validateUpdate(user) {
  const schema = Joi.object({
    username: Joi.string().trim().min(3).max(20),
    bio: Joi.string().max(100),
  });

  return schema.validate(user);
};

module.exports = {
  validateUser,
  validateLogin,
  validateResetPassword,
  validateUpdate,
};
