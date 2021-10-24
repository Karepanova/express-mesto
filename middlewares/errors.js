const { isCelebrateError } = require('celebrate');
const IncorrectDataError = require('../errors/incorrect-data-err');
const NotFoundError = require('../errors/not-found-err');
const DuplicateError = require('../errors/duplicate-err');

module.exports = (err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  let { statusCode = 500, message } = err;
  if (statusCode === 500) {
    if (isCelebrateError(err)) {
      if (!err.details.get('body')) {
        ({ statusCode, message } = new IncorrectDataError(err.details.get('params').message));
      } else {
        ({ statusCode, message } = new IncorrectDataError(err.details.get('body').message));
      }
    } else if (err.name === 'CastError') {
      ({ statusCode, message } = new IncorrectDataError('Некорректный id'));
    } else if (err.name === 'MongoServerError' && err.code === 11000) {
      ({ statusCode, message } = new DuplicateError('Пользователь с таким email уже существует!'));
    } else if (err.name === 'ValidationError') {
      ({ statusCode, message } = new IncorrectDataError('Некорректные данные'));
    } else if (err.message === 'NotFound') {
      ({ statusCode, message } = new NotFoundError('Данные не найдены'));
    }
  }
  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });

  next(); // пропускаем запрос дальше
};
