const validator = require('validator');
const { celebrate, Joi } = require('celebrate');
const IncorrectDataError = require('../errors/incorrect-data-err');

const method = (value) => {
  const result = validator.isURL(value);
  if (result) {
    return value;
  }
  throw new IncorrectDataError('Неправильный URL');
};

const validateCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(method),
    email: Joi.string().required().email(),
    password: Joi.string().min(8).required(),
  }),
});

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validateGetUser = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24).required(),
  }),
});

const validateUpdateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
});

const validateUpdateAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom(method),
  }),
});

const validateCreateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().custom(method),
  }),
});

const validateCardId = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().hex().length(24),
  }),
});
module.exports = {
  validateCreateUser,
  validateLogin,
  validateGetUser,
  validateUpdateUser,
  validateUpdateAvatar,
  validateCreateCard,
  validateCardId,
};
