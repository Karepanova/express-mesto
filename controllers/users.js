const jwt = require('jsonwebtoken'); // импортируем модуль jsonwebtoken
const bcrypt = require('bcryptjs'); // импортируем bcrypt
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');

// получить всех пользователей
const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

// получить пользователя по ID
const getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new NotFoundError('Нет пользователя с таким id');
    })
    .then((users) => res.send(users))
    .catch(next);
};

// создание пользователя
const createUser = (req, res, next) => {
  // получим из объекта запроса имя и описание пользователя
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.send(user)).catch(next);
};

// обновление пользователя
const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true })
    .orFail(() => {
      throw new NotFoundError('Нет пользователя с таким id');
    })
    .then((user) => res.send(user))
    .catch(next);
};

// обновление аватара
const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .orFail(() => {
      throw new NotFoundError('Нет пользователя с таким id');
    })
    .then((user) => res.send(user))
    .catch(next);
};

// получить пользователя по ID
const getUserMe = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError('Нет пользователя с таким id');
    })
    .then((user) => res.send(user))
    .catch(next);
};

// получить логин - почту и пароль и проверяет их
const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // создадим токен
      const token = jwt.sign(
        { _id: user._id },
        'someSecretKey-0000',
        { expiresIn: '7d' }, // токен будет просрочен через неделю после создания);
      );
      res
        .cookie('jwt', token, {
          // token - наш JWT токен, который мы отправляем
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
        });
      // вернём токен
      res.send({ token });
    })
    .catch(next);
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
  getUserMe,
  login,
};
