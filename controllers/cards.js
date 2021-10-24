const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');

// получаем все карточки
const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

// создаем карточку
const createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch(next);
};

// удаляем карточку
const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => {
      throw new NotFoundError('Нет карточки с таким id');
    })
    .then((card) => {
      if (card.owner.toString() === req.user._id) {
        Card.findOneAndRemove({
          _id: req.params.cardId,
          owner: req.user._id,
        })
          .then((delCard) => res.send(delCard));
      } else {
        throw new ForbiddenError('Нельзя удалить чужую карточку');
      }
    })
    .catch(next);
};

// добавляем лайк
const addLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(() => {
      throw new NotFoundError('Нет карточки с таким id');
    })
    .then((card) => res.send(card))
    .catch(next);
};

// удаляем лайк
const delLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail(() => {
      throw new NotFoundError('Нет карточки с таким id');
    })
    .then((card) => res.send(card))
    .catch(next);
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  addLike,
  delLike,
};
