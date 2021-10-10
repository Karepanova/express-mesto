const User = require("../models/user");
const {NotFoundError} = require("../errors/not-found");

const getUsers = (req, res, next) => {
  User.find({})
    .then(users => res.send(users))
    .catch(() => res.status(500).send({message: 'Произошла ошибка'}));
};

const getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new NotFoundError('Пользователь не найден')
    })
    .then(users => res.send(users))
    .catch((err) => {
      if(err.statusCode !== undefined){
        return res.status(err.statusCode).send({message: err.message})
      }
      return res.status(500).send({message: 'Произошла ошибка'})
    });
};

const createUser = (req, res, next) => {
  const {name, about, avatar} = req.body; // получим из объекта запроса имя и описание пользователя

  User.create({name, about, avatar}) // создадим документ на основе пришедших данных
    .then(user => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({message: 'Некорректные данные'})
      }
      return res.status(500).send({message: 'Произошла ошибка'})
    });
};

//обновление пользователя
const updateUser = (req, res, next) => {

  const {name, about} = req.body;
  User.findByIdAndUpdate(req.user._id, {name, about}, {new: true})
    .then(user => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({message: 'Некорректные данные'})
      }
      return res.status(500).send({message: 'Произошла ошибка'})
    });
};

const updateAvatar = (req, res, next) => {
  const {avatar} = req.body;
  User.findByIdAndUpdate(req.user._id, {avatar}, {new: true})
    .then(user => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({message: 'Некорректные данные'})
      }
      return res.status(500).send({message: 'Произошла ошибка'})
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar
}