const Card = require("../models/card");
const {NotFoundError} = require("../errors/not-found");


//получаем все карточки
const getCards = (req, res, next) => {
  Card.find({})
    .then(cards => res.send(cards))
    .catch(() => res.status(500).send({message: 'Произошла ошибка'}));
};

//создаем карточку
const createCard = (req, res, next) => {
  const {name, link} = req.body;

  Card.create({name, link, owner: req.user._id})
    .then(card => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({message: 'Некорректные данные'})
      }
      return res.status(500).send({message: 'Произошла ошибка'})
    });
};

//удаляем карточку
const deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => {
      throw new NotFoundError('Карточка не найдена')
    })
    .then(card => res.send(card))
    .catch((err) => {
      if (err.statusCode !== undefined) {
        return res.status(err.statusCode).send({message: err.message})
      }
      return res.status(500).send({message: 'Произошла ошибка'})
    });
};

//добавляем лайк
const addLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    {$addToSet: {likes: req.user._id}},// добавить _id в массив, если его там нет
    {new: true},
  )
    .orFail(() => {
      throw new NotFoundError('Карточка не найдена')
    })
    .then(card => res.send(card))
    .catch((err) => {
      if (err.statusCode !== undefined) {
        return res.status(err.statusCode).send({message: err.message})
      }
      return res.status(500).send({message: 'Произошла ошибка'})
    });
};

//удаляем лайк
const delLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    {$pull: {likes: req.user._id}},// убрать _id из массива
    {new: true},
  )
    .orFail(() => {
      throw new NotFoundError('Карточка не найдена')
    })
    .then(card => res.send(card))
    .catch((err) => {
      if (err.statusCode !== undefined) {
        return res.status(err.statusCode).send({message: err.message})
      }
      return res.status(500).send({message: 'Произошла ошибка'})
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  addLike,
  delLike
}